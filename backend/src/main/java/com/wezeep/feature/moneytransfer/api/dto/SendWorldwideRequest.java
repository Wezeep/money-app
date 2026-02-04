package com.wezeep.feature.moneytransfer.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SendWorldwideRequest {
    @NotBlank(message = "Recipient name is required")
    @Size(max = 200)
    private String recipientName;

    @NotBlank(message = "Recipient phone is required")
    @Size(max = 30)
    private String recipientPhone;

    @NotBlank(message = "Country code is required")
    @Pattern(regexp = "^[A-Z]{2}$", message = "Country code must be ISO 3166-1 alpha-2 (e.g. US, GB)")
    private String countryCode;

    @NotNull(message = "Send amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
    private BigDecimal sendAmount;

    @NotBlank(message = "Send currency is required")
    private String sendCurrency;

    @NotNull(message = "Receive amount is required")
    @DecimalMin(value = "0.01", message = "Receive amount must be at least 0.01")
    private BigDecimal receiveAmount;

    @NotBlank(message = "Receive currency is required")
    private String receiveCurrency;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    @NotBlank(message = "Delivery method is required")
    private String deliveryMethod;

    private String notes;
}
