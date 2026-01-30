package com.wezeep.api.controller;

import com.wezeep.api.dto.UserResponse;
import com.wezeep.domain.model.Wallet;
import com.wezeep.domain.repository.UserRepository;
import com.wezeep.domain.repository.WalletRepository;
import com.wezeep.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    public UserController(UserRepository userRepository, WalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        var user = userRepository.findById(userPrincipal.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        List<Wallet> wallets = walletRepository.findByUserId(user.getId());
        List<UserResponse.WalletBalanceDto> walletDtos = wallets.stream()
                .map(w -> UserResponse.WalletBalanceDto.builder()
                        .currency(w.getCurrency())
                        .balance(w.getBalance().toString())
                        .build())
                .collect(Collectors.toList());
        UserResponse response = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .wezeepId(user.getWezeepId())
                .homeCountry(user.getHomeCountry())
                .profileCompleted(user.getProfileCompleted())
                .wallets(walletDtos)
                .build();
        return ResponseEntity.ok(response);
    }
}
