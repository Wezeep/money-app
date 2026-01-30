package com.wezeep.api.controller;

import com.wezeep.api.dto.BillPaymentResponse;
import com.wezeep.api.dto.CreateBillPaymentRequest;
import com.wezeep.security.UserPrincipal;
import com.wezeep.service.BillPaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bill-payments")
public class BillPaymentController {

    private final BillPaymentService billPaymentService;

    public BillPaymentController(BillPaymentService billPaymentService) {
        this.billPaymentService = billPaymentService;
    }

    @PostMapping
    public ResponseEntity<BillPaymentResponse> create(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateBillPaymentRequest request) {
        return ResponseEntity.ok(billPaymentService.createPayment(userPrincipal.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<BillPaymentResponse>> getMyPayments(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(billPaymentService.getMyPayments(userPrincipal.getId()));
    }
}
