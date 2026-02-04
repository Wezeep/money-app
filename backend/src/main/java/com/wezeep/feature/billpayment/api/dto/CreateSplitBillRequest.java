package com.wezeep.feature.billpayment.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class CreateSplitBillRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.01", message = "Total amount must be at least 0.01")
    private BigDecimal totalAmount;

    @NotBlank(message = "Currency is required")
    @Size(max = 3)
    private String currency;

    @NotNull(message = "Equal split flag is required")
    private Boolean isEqualSplit = true;

    @Size(max = 500)
    private String notes;

    @NotEmpty(message = "At least one participant is required")
    @Valid
    private List<SplitBillParticipantInput> participants;

    @Data
    public static class SplitBillParticipantInput {
        private UUID userId;
        private UUID contactId; // optional; backend resolves to user via contact's wezeepId
        @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
        private BigDecimal amount; // optional when isEqualSplit
    }
}
