package com.wezeep.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "payment_methods", indexes = {
    @Index(name = "idx_user", columnList = "userId"),
    @Index(name = "idx_type", columnList = "type")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @NotNull(message = "Payment method type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private PaymentMethodType type;

    @NotBlank(message = "Provider is required")
    @Column(nullable = false, length = 100)
    private String provider;

    @Column(length = 500)
    private String providerAccountId;

    @Column(length = 500)
    private String encryptedDetails;

    @NotNull(message = "Is default flag is required")
    @Column(nullable = false)
    @Builder.Default
    private Boolean isDefault = false;

    @NotNull(message = "Is active flag is required")
    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    public enum PaymentMethodType {
        WEEZEEP_WALLET, BANK_ACCOUNT, CREDIT_CARD, DEBIT_CARD, MOBILE_MONEY
    }
}
