package com.wezeep.api.dto;

import com.wezeep.domain.model.RewardRedemption;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RewardRedemptionRequest {
    @NotNull(message = "Redemption type is required")
    private RewardRedemption.RedemptionType redemptionType;
    
    @NotNull(message = "Points is required")
    @DecimalMin(value = "0.01", message = "Points must be at least 0.01")
    private BigDecimal points;
}
