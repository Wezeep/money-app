package com.wezeep.api.controller;

import com.wezeep.api.dto.BillVendorResponse;
import com.wezeep.service.BillPaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
