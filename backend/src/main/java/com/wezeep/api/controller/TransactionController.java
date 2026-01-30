package com.wezeep.api.controller;

import com.wezeep.api.dto.SendMoneyRequest;
import com.wezeep.api.dto.TransactionResponse;
import com.wezeep.security.UserPrincipal;
import com.wezeep.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/send")
    public ResponseEntity<TransactionResponse> sendMoney(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody SendMoneyRequest request) {
        TransactionResponse response = transactionService.sendMoney(userPrincipal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<TransactionResponse>> getTransactions(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            Pageable pageable) {
        Page<TransactionResponse> transactions = transactionService.getUserTransactions(
                userPrincipal.getId(), pageable);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransaction(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        TransactionResponse transaction = transactionService.getTransaction(id, userPrincipal.getId());
        return ResponseEntity.ok(transaction);
    }
}
