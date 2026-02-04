package com.wezeep.service;

import com.wezeep.domain.model.*;
import com.wezeep.domain.repository.*;
import com.wezeep.feature.moneytransfer.api.dto.SendMoneyRequest;
import com.wezeep.feature.moneytransfer.api.dto.SendP2PRequest;
import com.wezeep.feature.moneytransfer.api.dto.SendWorldwideRequest;
import com.wezeep.api.dto.TransactionResponse;
import com.wezeep.feature.rewards.service.RewardService;
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
    private final ContactRepository contactRepository;
    private final WalletRepository walletRepository;
    private final FxRateService fxRateService;
    private final PaymentService paymentService;
    private final RewardAccountRepository rewardAccountRepository;
    private final RewardService rewardService;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            ContactRepository contactRepository,
            WalletRepository walletRepository,
            FxRateService fxRateService,
            PaymentService paymentService,
            RewardAccountRepository rewardAccountRepository,
            RewardService rewardService) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.contactRepository = contactRepository;
        this.walletRepository = walletRepository;
        this.fxRateService = fxRateService;
        this.paymentService = paymentService;
        this.rewardAccountRepository = rewardAccountRepository;
        this.rewardService = rewardService;
    }

    @Transactional
    public TransactionResponse sendP2P(UUID senderId, SendP2PRequest request) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        UUID recipientUserId = resolveRecipientUserId(request);
        User recipient = userRepository.findById(recipientUserId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        // P2P: recipient receives same currency as sent
        String receivedCurrency = request.getCurrency();
        BigDecimal exchangeRate = BigDecimal.ONE;
        BigDecimal amountReceived = request.getAmount();

        BigDecimal feePercentage = calculateTransactionFee(senderId, request.getAmount());
        BigDecimal transactionFee = request.getAmount().multiply(feePercentage).setScale(2, RoundingMode.HALF_UP);
        if (!paymentService.verifyBalance(senderId, request.getPaymentMethod(), request.getAmount().add(transactionFee))) {
            throw new RuntimeException("Insufficient balance");
        }

        Transaction transaction = transactionRepository.save(Transaction.builder()
        .transferType(Transaction.TransferType.P2P)
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
        .deliveryMethod("WEEZEEP_WALLET")
        .status(Transaction.TransactionStatus.PROCESSING)
        .notes(request.getNotes())
        .build());

        boolean paymentSuccess = paymentService.processPayment(
                senderId, request.getPaymentMethod(),
                request.getAmount().add(transactionFee), request.getCurrency());
        if (paymentSuccess) {
            paymentService.creditRecipient(recipient.getId(), amountReceived, receivedCurrency, "WEEZEEP_WALLET");
            transaction.markAsCompleted();
            transaction.setReference(generateReference());
        } else {
            transaction.markAsFailed();
        }
        transaction = transactionRepository.save(transaction);
        final Transaction txForTags = transaction;

        if (request.getTags() != null && !request.getTags().isEmpty()) {
            List<TransactionTag> tags = request.getTags().stream()
                    .limit(10)
                    .map(tagName -> TransactionTag.builder().transaction(txForTags).name(tagName).build())
                    .collect(Collectors.toList());
            txForTags.setTags(tags);
            transaction = transactionRepository.save(txForTags);
        }
        rewardService.awardPointsForTransaction(senderId, request.getAmount());
        rewardService.calculateCashback(senderId, transaction.getId());
        tryApplyReferralReward(senderId);
        return mapToResponse(transaction);
    }

    @Transactional
    public TransactionResponse sendWorldwide(UUID senderId, SendWorldwideRequest request) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        BigDecimal exchangeRate = request.getSendAmount().compareTo(BigDecimal.ZERO) > 0
                ? request.getReceiveAmount().divide(request.getSendAmount(), 6, RoundingMode.HALF_UP)
                : BigDecimal.ONE;
        BigDecimal feePercentage = calculateTransactionFee(senderId, request.getSendAmount());
        BigDecimal transactionFee = request.getSendAmount().multiply(feePercentage).setScale(2, RoundingMode.HALF_UP);
        if (!paymentService.verifyBalance(senderId, request.getPaymentMethod(), request.getSendAmount().add(transactionFee))) {
            throw new RuntimeException("Insufficient balance");
        }

        Transaction transaction = Transaction.builder()
                .transferType(Transaction.TransferType.INTERNATIONAL)
                .sender(sender)
                .recipient(null)
                .recipientName(request.getRecipientName())
                .recipientPhone(request.getRecipientPhone())
                .recipientCountryCode(request.getCountryCode())
                .amountSent(request.getSendAmount())
                .sentCurrency(request.getSendCurrency())
                .amountReceived(request.getReceiveAmount())
                .receivedCurrency(request.getReceiveCurrency())
                .exchangeRate(exchangeRate)
                .transactionFee(transactionFee)
                .transactionFeePercentage(feePercentage)
                .paymentMethod(request.getPaymentMethod())
                .deliveryMethod(request.getDeliveryMethod())
                .status(Transaction.TransactionStatus.PROCESSING)
                .notes(request.getNotes())
                .build();
        transaction = transactionRepository.save(transaction);

        boolean paymentSuccess = paymentService.processPayment(
                senderId, request.getPaymentMethod(),
                request.getSendAmount().add(transactionFee), request.getSendCurrency());
        if (paymentSuccess) {
            transaction.markAsCompleted();
            transaction.setReference(generateReference());
        } else {
            transaction.markAsFailed();
        }
        transaction = transactionRepository.save(transaction);

        rewardService.awardPointsForTransaction(senderId, request.getSendAmount());
        rewardService.calculateCashback(senderId, transaction.getId());
        tryApplyReferralReward(senderId);
        return mapToResponse(transaction);
    }

    private UUID resolveRecipientUserId(SendP2PRequest request) {
        if (request.getRecipientId() != null) {
            return request.getRecipientId();
        }
        if (request.getContactId() != null) {
            Contact contact = contactRepository.findById(request.getContactId())
                    .orElseThrow(() -> new RuntimeException("Contact not found"));
            if (contact.getWezeepId() == null || contact.getWezeepId().isBlank()) {
                throw new RuntimeException("Contact is not a Wezeep user");
            }
            return userRepository.findByWezeepId(contact.getWezeepId())
                    .orElseThrow(() -> new RuntimeException("Recipient Wezeep user not found"))
                    .getId();
        }
        throw new RuntimeException("Either recipientId or contactId is required");
    }

    private void tryApplyReferralReward(UUID senderId) {
        User senderUser = userRepository.findById(senderId).orElse(null);
        if (senderUser == null || senderUser.getReferredBy() == null || senderUser.getReferredBy().getIsCompleted()) {
            return;
        }
        long completedCount = transactionRepository.findBySenderIdAndStatus(
                senderId, Transaction.TransactionStatus.COMPLETED).size();
        if (completedCount == 1) {
            rewardService.awardPointsForReferral(
                    senderUser.getReferredBy().getReferrer().getId(),
                    senderId);
        }
    }

    @Transactional
    public TransactionResponse sendMoney(UUID senderId, SendMoneyRequest request) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        
        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        BigDecimal exchangeRate = fxRateService.getExchangeRate(request.getCurrency(), 
                recipient.getPreferredCurrency() == User.PreferredCurrency.USD ? "USD" : "NGN");
        BigDecimal amountReceived = request.getAmount().multiply(exchangeRate).setScale(2, RoundingMode.HALF_UP);
        String receivedCurrency = recipient.getPreferredCurrency() == User.PreferredCurrency.USD ? "USD" : "NGN";
        
        BigDecimal feePercentage = calculateTransactionFee(senderId, request.getAmount());
        BigDecimal transactionFee = request.getAmount().multiply(feePercentage).setScale(2, RoundingMode.HALF_UP);
        
        if (!paymentService.verifyBalance(senderId, request.getPaymentMethod(), request.getAmount().add(transactionFee))) {
            throw new RuntimeException("Insufficient balance");
        }

        Transaction transaction = Transaction.builder()
                .transferType(Transaction.TransferType.P2P)
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

        boolean paymentSuccess = paymentService.processPayment(
                senderId, request.getPaymentMethod(), 
                request.getAmount().add(transactionFee), request.getCurrency());

        if (paymentSuccess) {
            paymentService.creditRecipient(recipient.getId(), amountReceived, receivedCurrency, request.getDeliveryMethod());
            transaction.markAsCompleted();
            transaction.setReference(generateReference());
        } else {
            transaction.markAsFailed();
        }

        transaction = transactionRepository.save(transaction);
        final Transaction txForTagsWorldwide = transaction;

        if (request.getTags() != null && !request.getTags().isEmpty()) {
            List<TransactionTag> tags = request.getTags().stream()
                    .limit(10)
                    .map(tagName -> TransactionTag.builder()
                            .transaction(txForTagsWorldwide)
                            .name(tagName)
                            .build())
                    .collect(Collectors.toList());
            txForTagsWorldwide.setTags(tags);
            transaction = transactionRepository.save(txForTagsWorldwide);
        }

        rewardService.awardPointsForTransaction(senderId, request.getAmount());
        rewardService.calculateCashback(senderId, transaction.getId());
        tryApplyReferralReward(senderId);

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
        return "WZP-" + java.time.Year.now().getValue() + "-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase().replace("-", "");
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

        boolean isSender = transaction.getSender().getId().equals(userId);
        boolean isRecipient = transaction.getRecipient() != null && transaction.getRecipient().getId().equals(userId);
        if (!isSender && !isRecipient) {
            throw new RuntimeException("Unauthorized access to transaction");
        }

        return mapToResponse(transaction);
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        List<String> tags = transaction.getTags() != null ?
                transaction.getTags().stream().map(TransactionTag::getName).collect(Collectors.toList()) :
                List.of();

        TransactionResponse.TransactionResponseBuilder b = TransactionResponse.builder()
                .id(transaction.getId())
                .transferType(transaction.getTransferType())
                .senderId(transaction.getSender().getId())
                .senderName(transaction.getSender().getFirstName() + " " + transaction.getSender().getLastName())
                .senderWezeepId(transaction.getSender().getWezeepId())
                .recipientPhone(transaction.getRecipientPhone())
                .recipientCountryCode(transaction.getRecipientCountryCode());

        if (transaction.getRecipient() != null) {
            b.recipientId(transaction.getRecipient().getId())
                    .recipientName(transaction.getRecipient().getFirstName() + " " + transaction.getRecipient().getLastName())
                    .recipientWezeepId(transaction.getRecipient().getWezeepId());
        } else {
            b.recipientName(transaction.getRecipientName());
        }

        return b
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
