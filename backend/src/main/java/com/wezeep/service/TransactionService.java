package com.wezeep.service;

import com.wezeep.domain.model.*;
import com.wezeep.domain.repository.*;
import com.wezeep.api.dto.SendMoneyRequest;
import com.wezeep.api.dto.TransactionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final FxRateService fxRateService;
    private final PaymentService paymentService;
    private final RewardAccountRepository rewardAccountRepository;
    private final RewardService rewardService;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            WalletRepository walletRepository,
            FxRateService fxRateService,
            PaymentService paymentService,
            RewardAccountRepository rewardAccountRepository,
            RewardService rewardService) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.fxRateService = fxRateService;
        this.paymentService = paymentService;
        this.rewardAccountRepository = rewardAccountRepository;
        this.rewardService = rewardService;
    }

    @Transactional
    public TransactionResponse sendMoney(UUID senderId, SendMoneyRequest request) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        
        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        // Get exchange rate
        BigDecimal exchangeRate = fxRateService.getExchangeRate(request.getCurrency(), 
                recipient.getPreferredCurrency() == User.PreferredCurrency.USD ? "USD" : "NGN");
        
        // Calculate amounts
        BigDecimal amountReceived = request.getAmount().multiply(exchangeRate).setScale(2, RoundingMode.HALF_UP);
        String receivedCurrency = recipient.getPreferredCurrency() == User.PreferredCurrency.USD ? "USD" : "NGN";
        
        // Calculate transaction fee
        BigDecimal feePercentage = calculateTransactionFee(senderId, request.getAmount());
        BigDecimal transactionFee = request.getAmount().multiply(feePercentage).setScale(2, RoundingMode.HALF_UP);
        
        // Verify balance
        if (!paymentService.verifyBalance(senderId, request.getPaymentMethod(), request.getAmount().add(transactionFee))) {
            throw new RuntimeException("Insufficient balance");
        }

        // Create transaction
        Transaction transaction = Transaction.builder()
                .sender(sender)
                .recipient(recipient)
                .amountSent(request.getAmount())
                .sentCurrency(request.getCurrency())
                .amountReceived(amountReceived)
                .receivedCurrency(receivedCurrency)
                .exchangeRate(exchangeRate)
                .transactionFee(transactionFee)
                .transactionFeePercentage(feePercentage)
                .paymentMethod(request.getPaymentMethod())
                .deliveryMethod(request.getDeliveryMethod())
                .status(Transaction.TransactionStatus.PROCESSING)
                .notes(request.getNotes())
                .build();

        transaction = transactionRepository.save(transaction);

        // Process payment
        boolean paymentSuccess = paymentService.processPayment(
                senderId, request.getPaymentMethod(), 
                request.getAmount().add(transactionFee), request.getCurrency());

        if (paymentSuccess) {
            // Credit recipient
            paymentService.creditRecipient(recipient.getId(), amountReceived, receivedCurrency, request.getDeliveryMethod());
            
            transaction.markAsCompleted();
            transaction.setReference(generateReference());
        } else {
            transaction.markAsFailed();
        }

        transaction = transactionRepository.save(transaction);

        // Add tags
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            List<TransactionTag> tags = request.getTags().stream()
                    .limit(10)
                    .map(tagName -> TransactionTag.builder()
                            .transaction(transaction)
                            .name(tagName)
                            .build())
                    .collect(Collectors.toList());
            transaction.setTags(tags);
            transaction = transactionRepository.save(transaction);
        }

        // Update rewards - award points for transaction
        rewardService.awardPointsForTransaction(senderId, request.getAmount());
        
        // Calculate cashback
        rewardService.calculateCashback(senderId, transaction.getId());

        // Check if this is first transaction and user was referred
        User sender = userRepository.findById(senderId).orElseThrow();
        if (sender.getReferredBy() != null && !sender.getReferredBy().getIsCompleted()) {
            // Check if this is first completed transaction
            long completedCount = transactionRepository.findBySenderIdAndStatus(
                senderId, Transaction.TransactionStatus.COMPLETED).size();
            if (completedCount == 1) {
                // Award referral points to referrer
                rewardService.awardPointsForReferral(
                    sender.getReferredBy().getReferrer().getId(), 
                    senderId
                );
            }
        }

        return mapToResponse(transaction);
    }

    private BigDecimal calculateTransactionFee(UUID userId, BigDecimal amount) {
        // Calculate fee based on volume tier
        // This is a simplified version - in production, calculate based on user's transaction history
        BigDecimal baseFee = new BigDecimal("0.025"); // 2.5% default
        
        // Volume-based tier calculation would go here
        // For now, return base fee
        return baseFee;
    }

    private String generateReference() {
        return "WZP" + System.currentTimeMillis();
    }

    private void updateRewards(UUID userId) {
        // This is now handled by RewardService
        // Keeping for backward compatibility but delegating to RewardService
    }

    public Page<TransactionResponse> getUserTransactions(UUID userId, Pageable pageable) {
        return transactionRepository.findByUserId(userId, pageable)
                .map(this::mapToResponse);
    }

    public TransactionResponse getTransaction(UUID transactionId, UUID userId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getSender().getId().equals(userId) && 
            !transaction.getRecipient().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to transaction");
        }

        return mapToResponse(transaction);
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        List<String> tags = transaction.getTags() != null ?
                transaction.getTags().stream().map(TransactionTag::getName).collect(Collectors.toList()) :
                List.of();

        return TransactionResponse.builder()
                .id(transaction.getId())
                .senderId(transaction.getSender().getId())
                .senderName(transaction.getSender().getFirstName() + " " + transaction.getSender().getLastName())
                .senderWezeepId(transaction.getSender().getWezeepId())
                .recipientId(transaction.getRecipient().getId())
                .recipientName(transaction.getRecipient().getFirstName() + " " + transaction.getRecipient().getLastName())
                .recipientWezeepId(transaction.getRecipient().getWezeepId())
                .amountSent(transaction.getAmountSent())
                .sentCurrency(transaction.getSentCurrency())
                .amountReceived(transaction.getAmountReceived())
                .receivedCurrency(transaction.getReceivedCurrency())
                .exchangeRate(transaction.getExchangeRate())
                .transactionFee(transaction.getTransactionFee())
                .transactionFeePercentage(transaction.getTransactionFeePercentage())
                .forexMargin(transaction.getForexMargin())
                .forexMarginPercentage(transaction.getForexMarginPercentage())
                .paymentMethod(transaction.getPaymentMethod())
                .deliveryMethod(transaction.getDeliveryMethod())
                .status(transaction.getStatus())
                .reference(transaction.getReference())
                .notes(transaction.getNotes())
                .createdAt(transaction.getCreatedAt())
                .completedAt(transaction.getCompletedAt())
                .tags(tags)
                .build();
    }
}
