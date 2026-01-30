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
@Table(name = "referrals", indexes = {
    @Index(name = "idx_referrer", columnList = "referrerId"),
    @Index(name = "idx_referred", columnList = "referredUserId", unique = true),
    @Index(name = "idx_code", columnList = "referralCode", unique = true)
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Referral {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "Referrer is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referrerId", nullable = false)
    private User referrer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referredUserId")
    private User referredUser;

    @Column(nullable = false, unique = true, length = 50)
    private String referralCode;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isCompleted = false;

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal pointsEarned = BigDecimal.ZERO;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    @Column
    private Instant completedAt;
}
