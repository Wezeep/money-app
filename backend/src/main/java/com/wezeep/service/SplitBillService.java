package com.wezeep.service;

import com.wezeep.feature.billpayment.api.dto.CreateSplitBillRequest;
import com.wezeep.feature.billpayment.api.dto.SplitBillResponse;
import com.wezeep.domain.model.Contact;
import com.wezeep.domain.model.SplitBill;
import com.wezeep.domain.model.SplitBillParticipant;
import com.wezeep.domain.model.User;
import com.wezeep.domain.repository.ContactRepository;
import com.wezeep.domain.repository.SplitBillRepository;
import com.wezeep.domain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SplitBillService {

    private final SplitBillRepository splitBillRepository;
    private final UserRepository userRepository;
    private final ContactRepository contactRepository;

    public SplitBillService(SplitBillRepository splitBillRepository, UserRepository userRepository, ContactRepository contactRepository) {
        this.splitBillRepository = splitBillRepository;
        this.userRepository = userRepository;
        this.contactRepository = contactRepository;
    }

    /** Resolve participant to a user ID: use userId if present, else resolve from contactId via contact's wezeepId. */
    private UUID resolveUserId(UUID userId, UUID contactId) {
        if (userId != null) {
            return userId;
        }
        if (contactId != null) {
            Contact contact = contactRepository.findById(contactId).orElseThrow(() -> new RuntimeException("Contact not found"));
            if (contact.getWezeepId() == null || contact.getWezeepId().isBlank()) {
                throw new RuntimeException("Contact is not a Wezeep user");
            }
            return userRepository.findByWezeepId(contact.getWezeepId())
                    .orElseThrow(() -> new RuntimeException("Participant Wezeep user not found"))
                    .getId();
        }
        throw new RuntimeException("Either userId or contactId is required for each participant");
    }

    @Transactional
    public SplitBillResponse create(UUID creatorId, CreateSplitBillRequest dto) {
        User creator = userRepository.findById(creatorId).orElseThrow(() -> new RuntimeException("User not found"));

        SplitBill bill = SplitBill.builder()
                .creator(creator)
                .title(dto.getTitle())
                .totalAmount(dto.getTotalAmount())
                .currency(dto.getCurrency())
                .isEqualSplit(Boolean.TRUE.equals(dto.getIsEqualSplit()))
                .notes(dto.getNotes())
                .status(SplitBill.SplitBillStatus.ACTIVE)
                .groupLink("https://wezeep.app/split/" + UUID.randomUUID())
                .build();

        int size = dto.getParticipants().size();
        BigDecimal perPerson = Boolean.TRUE.equals(dto.getIsEqualSplit())
                ? dto.getTotalAmount().divide(BigDecimal.valueOf(size), 2, RoundingMode.HALF_UP)
                : null;

        for (CreateSplitBillRequest.SplitBillParticipantInput input : dto.getParticipants()) {
            UUID participantUserId = resolveUserId(input.getUserId(), input.getContactId());
            User user = userRepository.findById(participantUserId).orElseThrow(() -> new RuntimeException("Participant user not found"));
            BigDecimal amount = perPerson != null ? perPerson : (input.getAmount() != null ? input.getAmount() : perPerson);
            if (amount == null) amount = input.getAmount();
            SplitBillParticipant participant = SplitBillParticipant.builder()
                    .splitBill(bill)
                    .user(user)
                    .amount(amount)
                    .paidAmount(BigDecimal.ZERO)
                    .status(SplitBillParticipant.ParticipantStatus.PENDING)
                    .build();
            bill.getParticipants().add(participant);
        }
        bill = splitBillRepository.save(bill);
        return mapToResponse(bill);
    }

    public List<SplitBillResponse> getCreatedByMe(UUID userId) {
        return splitBillRepository.findByCreatorIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SplitBillResponse> getParticipating(UUID userId) {
        return splitBillRepository.findByParticipantId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SplitBillResponse payMyShare(UUID userId, UUID splitBillId, UUID participantId) {
        SplitBill bill = splitBillRepository.findById(splitBillId).orElseThrow(() -> new RuntimeException("Split bill not found"));
        SplitBillParticipant participant = bill.getParticipants().stream()
                .filter(p -> p.getId().equals(participantId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Participant not found"));
        if (!participant.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        participant.addPayment(participant.getAmount());
        if (bill.isAllParticipantsPaid()) {
            bill.markAsCompleted();
        }
        bill = splitBillRepository.save(bill);
        return mapToResponse(bill);
    }

    private SplitBillResponse mapToResponse(SplitBill b) {
        List<SplitBillResponse.ParticipantResponse> participants = b.getParticipants().stream()
                .map(p -> SplitBillResponse.ParticipantResponse.builder()
                        .id(p.getId())
                        .userId(p.getUser().getId())
                        .userName(p.getUser().getFirstName() + " " + p.getUser().getLastName())
                        .amount(p.getAmount())
                        .paidAmount(p.getPaidAmount())
                        .status(p.getStatus().name())
                        .paidAt(p.getPaidAt())
                        .build())
                .collect(Collectors.toList());
        return SplitBillResponse.builder()
                .id(b.getId())
                .creatorId(b.getCreator().getId())
                .creatorName(b.getCreator().getFirstName() + " " + b.getCreator().getLastName())
                .title(b.getTitle())
                .totalAmount(b.getTotalAmount())
                .currency(b.getCurrency())
                .isEqualSplit(b.getIsEqualSplit())
                .status(b.getStatus())
                .notes(b.getNotes())
                .groupLink(b.getGroupLink())
                .createdAt(b.getCreatedAt())
                .participants(participants)
                .build();
    }
}
