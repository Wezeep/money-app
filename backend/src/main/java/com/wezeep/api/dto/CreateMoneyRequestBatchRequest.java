package com.wezeep.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateMoneyRequestBatchRequest {
    @NotEmpty(message = "At least one request is required")
    @Valid
    private List<CreateMoneyRequestRequest> requests;
}
