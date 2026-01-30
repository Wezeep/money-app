package com.wezeep.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "idx_sender", columnList = "senderId"),
    @Index(name = "idx_recipient", columnList = "recipientId"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "createdAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "Sender is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "senderId", nullable = false)
    private User sender;

    @NotNull(message = "Recipient is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipientId", nullable = false)
    private User recipient;

    @NotNull(message = "Amount sent is required")
    @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amountSent;

    @NotBlank(message = "Sent currency is required")
    @Column(nullable = false, length = 3)
    private String sentCurrency;

    @NotNull(message = "Amount received is required")
    @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amountReceived;

    @NotBlank(message = "Received currency is required")
    @Column(nullable = false, length = 3)
    private String receivedCurrency;

    @Column(precision = 19, scale = 6)
    private BigDecimal exchangeRate;

    @Column(precision = 19, scale = 2)
    private BigDecimal transactionFee;

    @Column(precision = 5, scale = 4)
    private BigDecimal transactionFeePercentage;

    @Column(precision = 19, scale = 2)
    private BigDecimal forexMargin;

    @Column(precision = 5, scale = 4)
    private BigDecimal forexMarginPercentage;

    @NotBlank(message = "Payment method is required")
    @Column(nullable = false, length = 50)
    private String paymentMethod;

    @NotBlank(message = "Delivery method is required")
    @Column(nullable = false, length = 50)
    private String deliveryMethod;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TransactionStatus status = TransactionStatus.PENDING;

    @Column(length = 100)
    private String reference;

    @Size(max = 500)
    @Column(length = 500)
    private String notes;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    @Column
    private Instant completedAt;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TransactionTag> tags = new ArrayList<>();

    public enum TransactionStatus {
        PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED, DRAFT
    }

    public void markAsCompleted() {
        this.status = TransactionStatus.COMPLETED;
        this.completedAt = Instant.now();
    }

    public void markAsFailed() {
        this.status = TransactionStatus.FAILED;
    }
}
