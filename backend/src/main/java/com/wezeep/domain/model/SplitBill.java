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
@Table(name = "split_bills", indexes = {
    @Index(name = "idx_creator", columnList = "creatorId"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SplitBill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "Creator is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creatorId", nullable = false)
    private User creator;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Column(nullable = false, length = 200)
    private String title;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.01", message = "Total amount must be at least 0.01")
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalAmount;

    @NotBlank(message = "Currency is required")
    @Column(nullable = false, length = 3)
    private String currency;

    @NotNull(message = "Is equal split flag is required")
    @Column(nullable = false)
    @Builder.Default
    private Boolean isEqualSplit = true;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SplitBillStatus status = SplitBillStatus.ACTIVE;

    @Size(max = 500)
    @Column(length = 500)
    private String notes;

    @Size(max = 500)
    @Column(length = 500)
    private String groupLink;

    @Size(max = 500)
    @Column(length = 500)
    private String qrCode;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    @Column
    private Instant completedAt;

    @OneToMany(mappedBy = "splitBill", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SplitBillParticipant> participants = new ArrayList<>();

    public enum SplitBillStatus {
        ACTIVE, COMPLETED, CANCELLED
    }

    public void markAsCompleted() {
        this.status = SplitBillStatus.COMPLETED;
        this.completedAt = Instant.now();
    }

    public boolean isAllParticipantsPaid() {
        return participants.stream().allMatch(p -> p.getPaidAmount().compareTo(p.getAmount()) >= 0);
    }
}
