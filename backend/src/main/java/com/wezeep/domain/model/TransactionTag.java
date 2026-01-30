package com.wezeep.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "transaction_tags", indexes = {
    @Index(name = "idx_transaction_tags_transaction", columnList = "transactionId"),
    @Index(name = "idx_transaction_tags_name", columnList = "name")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionTag {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "Transaction is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transactionId", nullable = false)
    private Transaction transaction;

    @NotBlank(message = "Tag name is required")
    @Size(max = 50, message = "Tag name must not exceed 50 characters")
    @Column(nullable = false, length = 50)
    private String name;
}
