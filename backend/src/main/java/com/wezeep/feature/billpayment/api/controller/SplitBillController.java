package com.wezeep.feature.billpayment.api.controller;

import com.wezeep.feature.billpayment.api.dto.CreateSplitBillRequest;
import com.wezeep.feature.billpayment.api.dto.SplitBillResponse;
import com.wezeep.security.UserPrincipal;
import com.wezeep.service.SplitBillService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/split-bills")
public class SplitBillController {

    private final SplitBillService splitBillService;

    public SplitBillController(SplitBillService splitBillService) {
        this.splitBillService = splitBillService;
    }

    @PostMapping
    public ResponseEntity<SplitBillResponse> create(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateSplitBillRequest request) {
        return ResponseEntity.ok(splitBillService.create(userPrincipal.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<SplitBillResponse>> getCreatedByMe(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(splitBillService.getCreatedByMe(userPrincipal.getId()));
    }

    @GetMapping("/participating")
    public ResponseEntity<List<SplitBillResponse>> getParticipating(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(splitBillService.getParticipating(userPrincipal.getId()));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<SplitBillResponse> payMyShare(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id,
            @RequestParam UUID participantId) {
        return ResponseEntity.ok(splitBillService.payMyShare(userPrincipal.getId(), id, participantId));
    }
}
