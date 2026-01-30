package com.wezeep.domain.model;

import jakarta.persistence.*;
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
@Table(name = "reward_accounts", indexes = {
    @Index(name = "idx_reward_accounts_user", columnList = "userId", unique = true)
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "User is required")
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, precision = 19, scale = 2)
    @Builder.Default
    private BigDecimal totalPoints = BigDecimal.ZERO;

    @Column(nullable = false, precision = 19, scale = 2)
    @Builder.Default
    private BigDecimal currentPoints = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalTransactions = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalReferrals = 0;

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal totalCashbackEarned = BigDecimal.ZERO;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    public void addPoints(BigDecimal points) {
        this.totalPoints = this.totalPoints.add(points);
        this.currentPoints = this.currentPoints.add(points);
    }

    public void incrementTransactionCount() {
        this.totalTransactions++;
    }

    public void setTotalReferrals(Integer totalReferrals) {
        this.totalReferrals = totalReferrals;
    }

    public void setTotalCashbackEarned(BigDecimal totalCashbackEarned) {
        this.totalCashbackEarned = totalCashbackEarned;
    }
}
