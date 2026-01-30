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
@Table(name = "cashback_offers", indexes = {
    @Index(name = "idx_active", columnList = "isActive,startDate,endDate")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashbackOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 1000)
    private String description;

    @NotNull(message = "Cashback percentage is required")
    @DecimalMin(value = "0.0", message = "Cashback percentage cannot be negative")
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal cashbackPercentage;

    @Column(precision = 19, scale = 2)
    private BigDecimal minTransactionAmount;

    @Column(precision = 19, scale = 2)
    private BigDecimal maxCashbackAmount;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column
    private Instant startDate;

    @Column
    private Instant endDate;

    @Column(length = 50)
    private String applicableCountry;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;
}
