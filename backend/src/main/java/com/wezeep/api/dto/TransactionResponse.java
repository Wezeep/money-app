package com.wezeep.api.dto;

import com.wezeep.domain.model.Transaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private UUID id;
    private Transaction.TransferType transferType;
    private UUID senderId;
    private String senderName;
    private String senderWezeepId;
    private UUID recipientId;
    private String recipientName;
    private String recipientWezeepId;
    private String recipientPhone;
    private String recipientCountryCode;
    private BigDecimal amountSent;
    private String sentCurrency;
    private BigDecimal amountReceived;
    private String receivedCurrency;
    private BigDecimal exchangeRate;
    private BigDecimal transactionFee;
    private BigDecimal transactionFeePercentage;
    private BigDecimal forexMargin;
    private BigDecimal forexMarginPercentage;
    private String paymentMethod;
    private String deliveryMethod;
    private Transaction.TransactionStatus status;
    private String reference;
    private String notes;
    private Instant createdAt;
    private Instant completedAt;
    private List<String> tags;
}
