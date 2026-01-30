package com.wezeep.api.controller;

import com.wezeep.domain.model.MoneyRequest;
import com.wezeep.domain.model.User;
import com.wezeep.domain.repository.MoneyRequestRepository;
import com.wezeep.domain.repository.UserRepository;
import com.wezeep.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/money-requests")
public class MoneyRequestController {

    private final MoneyRequestRepository moneyRequestRepository;
    private final UserRepository userRepository;

    public MoneyRequestController(MoneyRequestRepository moneyRequestRepository, UserRepository userRepository) {
        this.moneyRequestRepository = moneyRequestRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<MoneyRequest> createMoneyRequest(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody MoneyRequest request) {
        request.setRequester(userRepository.findById(userPrincipal.getId()).orElseThrow());
        request.setRecipient(userRepository.findById(request.getRecipient().getId()).orElseThrow());
        
        if (!request.getIsFixedAmount()) {
            request.setExpiresAt(Instant.now().plusSeconds(45));
        }
        
        request.setShareableLink(generateShareableLink());
        MoneyRequest saved = moneyRequestRepository.save(request);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/sent")
    public ResponseEntity<List<MoneyRequest>> getSentRequests(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<MoneyRequest> requests = moneyRequestRepository.findByRequesterIdOrderByCreatedAtDesc(userPrincipal.getId());
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/received")
    public ResponseEntity<List<MoneyRequest>> getReceivedRequests(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<MoneyRequest> requests = moneyRequestRepository.findByRecipientIdOrderByCreatedAtDesc(userPrincipal.getId());
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/{id}/fulfill")
    public ResponseEntity<MoneyRequest> fulfillRequest(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        MoneyRequest request = moneyRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Money request not found"));
        
        if (!request.getRecipient().getId().equals(userPrincipal.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        request.markAsCompleted();
        MoneyRequest updated = moneyRequestRepository.save(request);
        return ResponseEntity.ok(updated);
    }

    private String generateShareableLink() {
        return "https://wezeep.app/request/" + UUID.randomUUID();
    }
}
