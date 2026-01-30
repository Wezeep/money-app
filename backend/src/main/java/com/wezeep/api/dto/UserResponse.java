package com.wezeep.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String email;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private String wezeepId;
    private String homeCountry;
    private Boolean profileCompleted;
    private List<WalletBalanceDto> wallets;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WalletBalanceDto {
        private String currency;
        private String balance;
    }
}
