package com.wezeep.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "split_bill_participants", indexes = {
    @Index(name = "idx_split_bill", columnList = "splitBillId"),
    @Index(name = "idx_user", columnList = "userId"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SplitBillParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "Split bill is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "splitBillId", nullable = false)
    private SplitBill splitBill;

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @NotNull(message = "Paid amount is required")
    @DecimalMin(value = "0.0", message = "Paid amount cannot be negative")
    @Column(nullable = false, precision = 19, scale = 2)
    @Builder.Default
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ParticipantStatus status = ParticipantStatus.PENDING;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    @Column
    private Instant paidAt;

    @Column
    private Instant lastReminderSentAt;

    public enum ParticipantStatus {
        PENDING, PARTIALLY_PAID, PAID
    }

    public void addPayment(BigDecimal amount) {
        this.paidAmount = this.paidAmount.add(amount);
        if (this.paidAmount.compareTo(this.amount) >= 0) {
            this.status = ParticipantStatus.PAID;
            this.paidAt = Instant.now();
        } else if (this.paidAmount.compareTo(BigDecimal.ZERO) > 0) {
            this.status = ParticipantStatus.PARTIALLY_PAID;
        }
    }

    public boolean isFullyPaid() {
        return this.paidAmount.compareTo(this.amount) >= 0;
    }

    public BigDecimal getRemainingAmount() {
        return this.amount.subtract(this.paidAmount);
    }
}
