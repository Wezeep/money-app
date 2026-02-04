package com.wezeep.feature.moneyrequest.api.dto;

import com.wezeep.domain.model.MoneyRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoneyRequestResponse {
    private UUID id;
    private UUID requesterId;
    private String requesterName;
    private String requesterWezeepId;
    private UUID recipientId;
    private String recipientName;
    private String recipientWezeepId;
    private BigDecimal amount;
    private String currency;
    private Boolean isFixedAmount;
    private String notes;
    private MoneyRequest.MoneyRequestStatus status;
    private Instant createdAt;
    private Instant expiresAt;
    private Instant completedAt;
    private String shareableLink;
}