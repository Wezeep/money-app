package com.wezeep.feature.billpayment.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wezeep.feature.billpayment.api.dto.BillVendorResponse;
import com.wezeep.feature.billpayment.service.BillPaymentService;

@RestController
@RequestMapping("/api/bill-vendors")
public class BillVendorController {

    private final BillPaymentService billPaymentService;

    public BillVendorController(BillPaymentService billPaymentService) {
        this.billPaymentService = billPaymentService;
    }

    @GetMapping
    public ResponseEntity<List<BillVendorResponse>> getAll() {
        return ResponseEntity.ok(billPaymentService.getAllVendors());
    }
}
