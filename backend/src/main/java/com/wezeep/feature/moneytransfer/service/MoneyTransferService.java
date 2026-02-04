package com.wezeep.feature.moneytransfer.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wezeep.feature.moneytransfer.api.dto.SendP2PRequest;
import com.wezeep.feature.moneytransfer.api.dto.SendWorldwideRequest;
import com.wezeep.api.dto.TransactionResponse;
import com.wezeep.domain.model.Contact;
import com.wezeep.domain.model.Transaction;
import com.wezeep.domain.model.TransactionTag;
import com.wezeep.domain.model.User;
import com.wezeep.domain.repository.ContactRepository;
import com.wezeep.domain.repository.RewardAccountRepository;
import com.wezeep.domain.repository.TransactionRepository;
import com.wezeep.domain.repository.UserRepository;
import com.wezeep.domain.repository.WalletRepository;
import com.wezeep.service.FxRateService;
import com.wezeep.service.PaymentService;
import com.wezeep.feature.rewards.service.RewardService;

/**
 * Feature-scoped service for money transfer operations.
 * Coordinates P2P and international money transfers.
 */
@Service
public class MoneyTransferService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final ContactRepository contactRepository;
    private final WalletRepository walletRepository;
    private final FxRateService fxRateService;
    private final PaymentService paymentService;
    private final RewardAccountRepository rewardAccountRepository;
    private final RewardService rewardService;

    public MoneyTransferService(
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

    public TransactionResponse getTransaction(UUID transactionId, UUID userId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        if (!transaction.getSender().getId().equals(userId) && (transaction.getRecipient() == null || !transaction.getRecipient().getId().equals(userId))) {
            throw new RuntimeException("Unauthorized");
        }
        return mapToResponse(transaction);
    }

    public Page<TransactionResponse> getUserTransactions(UUID userId, Pageable pageable) {
        return transactionRepository.findByUserId(userId, pageable)
                .map(this::mapToResponse);
    }

    // Helpers
    private UUID resolveRecipientUserId(SendP2PRequest request) {
        if (request.getRecipientId() != null) return request.getRecipientId();
        if (request.getContactId() != null) {
            Contact contact = contactRepository.findById(request.getContactId())
                    .orElseThrow(() -> new RuntimeException("Contact not found"));
            if (contact.getWezeepId() == null || contact.getWezeepId().isBlank())
                throw new RuntimeException("Contact is not a Wezeep user");
            return userRepository.findByWezeepId(contact.getWezeepId())
                    .orElseThrow(() -> new RuntimeException("Recipient user not found")).getId();
        }
        throw new RuntimeException("Either recipientId or contactId is required");
    }

    private BigDecimal calculateTransactionFee(UUID userId, BigDecimal amount) {
        return BigDecimal.valueOf(0.01); // 1% placeholder
    }

    private void tryApplyReferralReward(UUID userId) {
        // Placeholder for referral logic
    }

    private String generateReference() {
        return "WZP-" + System.currentTimeMillis();
    }

    private TransactionResponse mapToResponse(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .transferType(t.getTransferType() != null ? t.getTransferType() : Transaction.TransferType.P2P)
                .senderId(t.getSender().getId())
                .senderName(t.getSender().getFirstName() + " " + t.getSender().getLastName())
                .senderWezeepId(t.getSender().getWezeepId())
                .recipientId(t.getRecipient() != null ? t.getRecipient().getId() : null)
                .recipientName(t.getRecipient() != null ? t.getRecipient().getFirstName() + " " + t.getRecipient().getLastName() : t.getRecipientName())
                .recipientWezeepId(t.getRecipient() != null ? t.getRecipient().getWezeepId() : null)
                .recipientPhone(t.getRecipientPhone())
                .recipientCountryCode(t.getRecipientCountryCode())
                .amountSent(t.getAmountSent())
                .sentCurrency(t.getSentCurrency())
                .amountReceived(t.getAmountReceived())
                .receivedCurrency(t.getReceivedCurrency())
                .exchangeRate(t.getExchangeRate())
                .transactionFee(t.getTransactionFee())
                .transactionFeePercentage(t.getTransactionFeePercentage())
                .forexMargin(t.getForexMargin())
                .forexMarginPercentage(t.getForexMarginPercentage())
                .paymentMethod(t.getPaymentMethod())
                .deliveryMethod(t.getDeliveryMethod())
                .status(t.getStatus() != null ? t.getStatus() : Transaction.TransactionStatus.PENDING)
                .reference(t.getReference())
                .notes(t.getNotes())
                .createdAt(t.getCreatedAt())
                .completedAt(t.getCompletedAt())
                .tags(t.getTags() != null ? t.getTags().stream().map(TransactionTag::getName).collect(Collectors.toList()) : null)
                .build();
    }
}
