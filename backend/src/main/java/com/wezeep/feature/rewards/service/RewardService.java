package com.wezeep.feature.rewards.service;

import com.wezeep.domain.model.*;
import com.wezeep.domain.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class RewardService {

    private final RewardAccountRepository rewardAccountRepository;
    private final ReferralRepository referralRepository;
    private final CashbackOfferRepository cashbackOfferRepository;
    private final RewardRedemptionRepository redemptionRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public RewardService(
            RewardAccountRepository rewardAccountRepository,
            ReferralRepository referralRepository,
            CashbackOfferRepository cashbackOfferRepository,
            RewardRedemptionRepository redemptionRepository,
            UserRepository userRepository,
            TransactionRepository transactionRepository) {
        this.rewardAccountRepository = rewardAccountRepository;
        this.referralRepository = referralRepository;
        this.cashbackOfferRepository = cashbackOfferRepository;
        this.redemptionRepository = redemptionRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public void awardPointsForTransaction(UUID userId, BigDecimal amount) {
        RewardAccount account = getOrCreateRewardAccount(userId);
        
        // Award points based on transaction amount (1 point per $1)
        BigDecimal points = amount.setScale(2, java.math.RoundingMode.HALF_UP);
        account.addPoints(points);
        account.incrementTransactionCount();
        
        rewardAccountRepository.save(account);
    }

    @Transactional
    public void awardPointsForReferral(UUID referrerId, UUID referredUserId) {
        RewardAccount account = getOrCreateRewardAccount(referrerId);
        
        // Award referral points (e.g., 100 points)
        BigDecimal referralPoints = new BigDecimal("100");
        account.addPoints(referralPoints);
        account.setTotalReferrals(account.getTotalReferrals() + 1);
        
        rewardAccountRepository.save(account);

        // Update referral record
        Referral referral = referralRepository.findByReferredUserId(referredUserId)
                .orElseThrow(() -> new RuntimeException("Referral not found"));
        referral.setIsCompleted(true);
        referral.setPointsEarned(referralPoints);
        referralRepository.save(referral);
    }

    @Transactional
    public void awardPointsForProfileCompletion(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getProfileCompleted()) {
            RewardAccount account = getOrCreateRewardAccount(userId);
            
            // Award profile completion points (e.g., 50 points)
            BigDecimal points = new BigDecimal("50");
            account.addPoints(points);
            
            rewardAccountRepository.save(account);
            
            user.setProfileCompleted(true);
            userRepository.save(user);
        }
    }

    @Transactional
    public void calculateCashback(UUID userId, UUID transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Find applicable cashback offers
        var offers = cashbackOfferRepository.findActiveOffersByCountry(
                transaction.getSender().getHomeCountry(), 
                java.time.Instant.now());

        BigDecimal totalCashback = BigDecimal.ZERO;
        
        for (CashbackOffer offer : offers) {
            if (offer.getMinTransactionAmount() == null || 
                transaction.getAmountSent().compareTo(offer.getMinTransactionAmount()) >= 0) {
                
                BigDecimal cashback = transaction.getAmountSent()
                        .multiply(offer.getCashbackPercentage())
                        .divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP);
                
                if (offer.getMaxCashbackAmount() != null && 
                    cashback.compareTo(offer.getMaxCashbackAmount()) > 0) {
                    cashback = offer.getMaxCashbackAmount();
                }
                
                totalCashback = totalCashback.add(cashback);
            }
        }

        if (totalCashback.compareTo(BigDecimal.ZERO) > 0) {
            RewardAccount account = getOrCreateRewardAccount(userId);
            account.addPoints(totalCashback);
            account.setTotalCashbackEarned(account.getTotalCashbackEarned().add(totalCashback));
            rewardAccountRepository.save(account);
        }
    }

    @Transactional
    public RewardRedemption redeemRewards(UUID userId, RewardRedemption.RedemptionType type, BigDecimal points) {
        RewardAccount account = getOrCreateRewardAccount(userId);
        
        if (account.getCurrentPoints().compareTo(points) < 0) {
            throw new RuntimeException("Insufficient points");
        }

        // Calculate cash value (e.g., 100 points = $1)
        BigDecimal cashValue = points.divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP);

        RewardRedemption redemption = RewardRedemption.builder()
                .user(account.getUser())
                .redemptionType(type)
                .pointsUsed(points)
                .cashValue(cashValue)
                .status(RewardRedemption.RedemptionStatus.PENDING)
                .build();

        redemption = redemptionRepository.save(redemption);

        // Deduct points
        account.setCurrentPoints(account.getCurrentPoints().subtract(points));
        rewardAccountRepository.save(account);

        // Process redemption (in production, this would integrate with payment systems)
        processRedemption(redemption);

        return redemption;
    }

    private void processRedemption(RewardRedemption redemption) {
        // In production, this would process the redemption based on type
        // For now, mark as completed
        redemption.setStatus(RewardRedemption.RedemptionStatus.COMPLETED);
        redemption.setProcessedAt(java.time.Instant.now());
        redemptionRepository.save(redemption);
    }

    private RewardAccount getOrCreateRewardAccount(UUID userId) {
        return rewardAccountRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId).orElseThrow();
                    RewardAccount account = RewardAccount.builder()
                            .user(user)
                            .totalPoints(BigDecimal.ZERO)
                            .currentPoints(BigDecimal.ZERO)
                            .totalTransactions(0)
                            .totalReferrals(0)
                            .totalCashbackEarned(BigDecimal.ZERO)
                            .build();
                    return rewardAccountRepository.save(account);
                });
    }
}
