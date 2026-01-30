package com.wezeep.api.controller;

import com.wezeep.domain.model.Wallet;
import com.wezeep.domain.repository.WalletRepository;
import com.wezeep.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/wallets")
public class WalletController {

    private final WalletRepository walletRepository;

    public WalletController(WalletRepository walletRepository) {
        this.walletRepository = walletRepository;
    }

    @GetMapping
    public ResponseEntity<List<Wallet>> getWallets(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Wallet> wallets = walletRepository.findByUserId(userPrincipal.getId());
        return ResponseEntity.ok(wallets);
    }

    @GetMapping("/{currency}")
    public ResponseEntity<Wallet> getWallet(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String currency) {
        Wallet wallet = walletRepository.findByUserIdAndCurrency(userPrincipal.getId(), currency)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        return ResponseEntity.ok(wallet);
    }
}
