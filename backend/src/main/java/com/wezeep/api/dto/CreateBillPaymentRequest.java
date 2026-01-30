package com.wezeep.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateBillPaymentRequest {
    @NotNull(message = "Vendor ID is required")
    private UUID vendorId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
    private BigDecimal amount;

    @NotBlank(message = "Currency is required")
    @Size(max = 3)
    private String currency;

    @NotBlank(message = "Frequency is required")
    @Size(max = 20)
    private String frequency; // one-time, monthly, yearly

    @Size(max = 500)
    private String notes;
}
