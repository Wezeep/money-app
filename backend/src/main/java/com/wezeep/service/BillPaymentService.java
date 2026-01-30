package com.wezeep.service;

import com.wezeep.api.dto.BillPaymentResponse;
import com.wezeep.api.dto.BillVendorResponse;
import com.wezeep.api.dto.CreateBillPaymentRequest;
import com.wezeep.domain.model.BillPayment;
import com.wezeep.domain.model.BillVendor;
import com.wezeep.domain.model.User;
import com.wezeep.domain.repository.BillPaymentRepository;
import com.wezeep.domain.repository.BillVendorRepository;
import com.wezeep.domain.repository.UserRepository;
import com.wezeep.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BillPaymentService {

    private final BillVendorRepository billVendorRepository;
    private final BillPaymentRepository billPaymentRepository;
    private final UserRepository userRepository;
    private final PaymentService paymentService;

    public BillPaymentService(BillVendorRepository billVendorRepository,
                              BillPaymentRepository billPaymentRepository,
                              UserRepository userRepository,
                              PaymentService paymentService) {
        this.billVendorRepository = billVendorRepository;
        this.billPaymentRepository = billPaymentRepository;
        this.userRepository = userRepository;
        this.paymentService = paymentService;
    }

    public List<BillVendorResponse> getAllVendors() {
        return billVendorRepository.findAll().stream().map(this::mapVendorToResponse).collect(Collectors.toList());
    }

    @Transactional
    public BillPaymentResponse createPayment(UUID userId, CreateBillPaymentRequest dto) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        BillVendor vendor = billVendorRepository.findById(dto.getVendorId()).orElseThrow(() -> new RuntimeException("Vendor not found"));

        if (!paymentService.verifyBalance(userId, "WEEZEEP_WALLET", dto.getAmount())) {
            throw new RuntimeException("Insufficient balance");
        }

        BillPayment payment = BillPayment.builder()
                .user(user)
                .vendor(vendor)
                .amount(dto.getAmount())
                .currency(dto.getCurrency())
                .frequency(dto.getFrequency() != null ? dto.getFrequency() : "one-time")
                .notes(dto.getNotes())
                .status(BillPayment.BillPaymentStatus.PROCESSING)
                .reference("BP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .build();
        payment = billPaymentRepository.save(payment);

        boolean success = paymentService.processPayment(userId, "WEEZEEP_WALLET", dto.getAmount(), dto.getCurrency());
        if (success) {
            payment.markCompleted();
        } else {
            payment.setStatus(BillPayment.BillPaymentStatus.FAILED);
        }
        payment = billPaymentRepository.save(payment);
        return mapPaymentToResponse(payment);
    }

    public List<BillPaymentResponse> getMyPayments(UUID userId) {
        return billPaymentRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapPaymentToResponse)
                .collect(Collectors.toList());
    }

    private BillVendorResponse mapVendorToResponse(BillVendor v) {
        return BillVendorResponse.builder()
                .id(v.getId())
                .name(v.getName())
                .category(v.getCategory())
                .icon(v.getIcon())
                .color(v.getColor())
                .build();
    }

    private BillPaymentResponse mapPaymentToResponse(BillPayment p) {
        return BillPaymentResponse.builder()
                .id(p.getId())
                .vendorId(p.getVendor().getId())
                .vendorName(p.getVendor().getName())
                .vendorCategory(p.getVendor().getCategory())
                .amount(p.getAmount())
                .currency(p.getCurrency())
                .frequency(p.getFrequency())
                .status(p.getStatus())
                .reference(p.getReference())
                .createdAt(p.getCreatedAt())
                .completedAt(p.getCompletedAt())
                .build();
    }
}
