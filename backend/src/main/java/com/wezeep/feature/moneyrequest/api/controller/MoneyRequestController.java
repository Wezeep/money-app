package com.wezeep.feature.moneyrequest.api.controller;

import com.wezeep.feature.moneyrequest.api.dto.CreateMoneyRequestRequest;
import com.wezeep.feature.moneyrequest.api.dto.MoneyRequestResponse;
import com.wezeep.security.UserPrincipal;
import com.wezeep.feature.moneyrequest.service.MoneyRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/money-requests")
public class MoneyRequestController {

    private final MoneyRequestService moneyRequestService;

    public MoneyRequestController(MoneyRequestService moneyRequestService) {
        this.moneyRequestService = moneyRequestService;
    }

    @PostMapping
    public ResponseEntity<MoneyRequestResponse> create(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateMoneyRequestRequest request) {
        MoneyRequestResponse response = moneyRequestService.create(userPrincipal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sent")
    public ResponseEntity<List<MoneyRequestResponse>> getSent(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(moneyRequestService.getSent(userPrincipal.getId()));
    }

    @GetMapping("/received")
    public ResponseEntity<List<MoneyRequestResponse>> getReceived(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(moneyRequestService.getReceived(userPrincipal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MoneyRequestResponse> getById(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        return ResponseEntity.ok(moneyRequestService.getById(id, userPrincipal.getId()));
    }

    @PostMapping("/{id}/fulfill")
    public ResponseEntity<MoneyRequestResponse> fulfill(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        return ResponseEntity.ok(moneyRequestService.fulfill(userPrincipal.getId(), id));
    }
}