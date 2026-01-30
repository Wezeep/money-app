package com.wezeep.api.dto;

import com.wezeep.domain.model.BillPayment;
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
public class BillPaymentResponse {
    private UUID id;
    private UUID vendorId;
    private String vendorName;
    private String vendorCategory;
    private BigDecimal amount;
    private String currency;
    private String frequency;
    private BillPayment.BillPaymentStatus status;
    private String reference;
    private Instant createdAt;
    private Instant completedAt;
}
