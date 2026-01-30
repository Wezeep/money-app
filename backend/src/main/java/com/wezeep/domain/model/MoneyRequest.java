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
@Table(name = "money_requests", indexes = {
    @Index(name = "idx_money_requests_requester", columnList = "requesterId"),
    @Index(name = "idx_money_requests_recipient", columnList = "recipientId"),
    @Index(name = "idx_money_requests_status", columnList = "status"),
    @Index(name = "idx_money_requests_expires_at", columnList = "expiresAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoneyRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "Requester is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requesterId", nullable = false)
    private User requester;

    @NotNull(message = "Recipient is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipientId", nullable = false)
    private User recipient;

    @Column(precision = 19, scale = 2)
    private BigDecimal fixedAmount;

    @NotBlank(message = "Currency is required")
    @Column(nullable = false, length = 3)
    private String currency;

    @NotNull(message = "Is fixed amount flag is required")
    @Column(nullable = false)
    @Builder.Default
    private Boolean isFixedAmount = true;

    @Size(max = 500)
    @Column(length = 500)
    private String notes;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private MoneyRequestStatus status = MoneyRequestStatus.PENDING;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    @Column
    private Instant expiresAt;

    @Column
    private Instant completedAt;

    @Size(max = 500)
    @Column(length = 500)
    private String shareableLink;

    public enum MoneyRequestStatus {
        PENDING, COMPLETED, EXPIRED, CANCELLED
    }

    public boolean isExpired() {
        return expiresAt != null && Instant.now().isAfter(expiresAt);
    }

    public void markAsCompleted() {
        this.status = MoneyRequestStatus.COMPLETED;
        this.completedAt = Instant.now();
    }

    public void markAsExpired() {
        this.status = MoneyRequestStatus.EXPIRED;
    }
}
