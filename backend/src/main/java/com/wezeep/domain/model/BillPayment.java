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
import java.util.UUID;

@Entity
@Table(name = "bill_payments", indexes = {
    @Index(name = "idx_bill_payments_user", columnList = "user_id"),
    @Index(name = "idx_bill_payments_vendor", columnList = "vendor_id"),
    @Index(name = "idx_bill_payments_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private BillVendor vendor;

    @NotNull
    @DecimalMin(value = "0.01")
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @NotBlank
    @Column(nullable = false, length = 3)
    private String currency = "USD";

    @NotBlank
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String frequency = "one-time";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BillPaymentStatus status = BillPaymentStatus.PENDING;

    @Size(max = 100)
    @Column(length = 100)
    private String reference;

    @Size(max = 500)
    @Column(length = 500)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    public enum BillPaymentStatus {
        PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED
    }

    public void markCompleted() {
        this.status = BillPaymentStatus.COMPLETED;
        this.completedAt = Instant.now();
    }
}
