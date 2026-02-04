package com.wezeep.feature.moneytransfer.api.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wezeep.feature.moneytransfer.api.dto.SendP2PRequest;
import com.wezeep.feature.moneytransfer.api.dto.SendWorldwideRequest;
import com.wezeep.api.dto.TransactionResponse;
import com.wezeep.feature.moneytransfer.service.MoneyTransferService;
import com.wezeep.security.UserPrincipal;

import jakarta.validation.Valid;

/**
 * Feature-scoped Money Transfer API Controller.
 * Handles P2P and international money transfer operations.
 */
@RestController
@RequestMapping("/api/transactions")
public class MoneyTransferController {

    private final MoneyTransferService moneyTransferService;

    public MoneyTransferController(MoneyTransferService moneyTransferService) {
        this.moneyTransferService = moneyTransferService;
    }

    @PostMapping("/send/p2p")
    public ResponseEntity<TransactionResponse> sendP2P(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody SendP2PRequest request) {
        TransactionResponse response = moneyTransferService.sendP2P(userPrincipal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/send/worldwide")
    public ResponseEntity<TransactionResponse> sendWorldwide(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody SendWorldwideRequest request) {
        TransactionResponse response = moneyTransferService.sendWorldwide(userPrincipal.getId(), request);
        return ResponseEntity.ok(response);
    }
}
