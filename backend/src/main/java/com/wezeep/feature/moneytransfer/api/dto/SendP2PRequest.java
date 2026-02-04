package com.wezeep.feature.moneytransfer.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class SendP2PRequest {
    /** Wezeep User ID of the recipient. Optional if contactId is provided. */
    private UUID recipientId;
    /** Contact ID; backend resolves to User via contact's wezeepId. Optional if recipientId is provided. */
    private UUID contactId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
    private BigDecimal amount;

    @NotBlank(message = "Currency is required")
    private String currency;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    private String notes;
    private List<String> tags;
}
