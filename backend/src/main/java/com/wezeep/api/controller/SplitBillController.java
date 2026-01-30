package com.wezeep.api.controller;

import com.wezeep.domain.model.SplitBill;
import com.wezeep.domain.model.SplitBillParticipant;
import com.wezeep.domain.repository.SplitBillRepository;
import com.wezeep.domain.repository.UserRepository;
import com.wezeep.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/split-bills")
public class SplitBillController {

    private final SplitBillRepository splitBillRepository;
    private final UserRepository userRepository;

    public SplitBillController(SplitBillRepository splitBillRepository, UserRepository userRepository) {
        this.splitBillRepository = splitBillRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<SplitBill> createSplitBill(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody SplitBill splitBill) {
        splitBill.setCreator(userRepository.findById(userPrincipal.getId()).orElseThrow());
        splitBill.setGroupLink(generateGroupLink());
        SplitBill saved = splitBillRepository.save(splitBill);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<SplitBill>> getSplitBills(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<SplitBill> bills = splitBillRepository.findByCreatorIdOrderByCreatedAtDesc(userPrincipal.getId());
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/participating")
    public ResponseEntity<List<SplitBill>> getParticipatingBills(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<SplitBill> bills = splitBillRepository.findByParticipantId(userPrincipal.getId());
        return ResponseEntity.ok(bills);
    }

    @PostMapping("/{id}/participants")
    public ResponseEntity<SplitBill> addParticipant(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id,
            @Valid @RequestBody SplitBillParticipant participant) {
        SplitBill splitBill = splitBillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Split bill not found"));
        
        if (!splitBill.getCreator().getId().equals(userPrincipal.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        participant.setSplitBill(splitBill);
        participant.setUser(userRepository.findById(participant.getUser().getId()).orElseThrow());
        splitBill.getParticipants().add(participant);
        
        SplitBill updated = splitBillRepository.save(splitBill);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<SplitBillParticipant> paySplitBill(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id,
            @RequestParam UUID participantId) {
        SplitBill splitBill = splitBillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Split bill not found"));
        
        SplitBillParticipant participant = splitBill.getParticipants().stream()
                .filter(p -> p.getId().equals(participantId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Participant not found"));
        
        if (!participant.getUser().getId().equals(userPrincipal.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        participant.addPayment(participant.getAmount());
        splitBillRepository.save(splitBill);
        
        return ResponseEntity.ok(participant);
    }

    private String generateGroupLink() {
        return "https://wezeep.app/split/" + UUID.randomUUID();
    }
}
