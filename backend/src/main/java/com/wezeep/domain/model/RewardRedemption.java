package com.wezeep.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
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
@Table(name = "reward_redemptions", indexes = {
    @Index(name = "idx_user", columnList = "userId"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardRedemption {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @NotBlank(message = "Redemption type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private RedemptionType redemptionType;

    @NotNull(message = "Points used is required")
    @DecimalMin(value = "0.01", message = "Points must be at least 0.01")
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal pointsUsed;

    @Column(precision = 19, scale = 2)
    private BigDecimal cashValue;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RedemptionStatus status = RedemptionStatus.PENDING;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    @Column
    private Instant processedAt;

    public enum RedemptionType {
        CASH, DISCOUNT, GIFT_CARD, CHARITY
    }

    public enum RedemptionStatus {
        PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED
    }
}
