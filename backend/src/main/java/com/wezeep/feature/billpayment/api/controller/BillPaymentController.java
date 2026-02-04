package com.wezeep.feature.billpayment.api.controller;

import com.wezeep.feature.billpayment.api.dto.BillPaymentResponse;
import com.wezeep.feature.billpayment.api.dto.CreateBillPaymentRequest;
import com.wezeep.security.UserPrincipal;
import com.wezeep.feature.billpayment.service.BillPaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
