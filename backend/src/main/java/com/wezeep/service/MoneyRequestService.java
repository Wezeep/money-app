package com.wezeep.service;

import com.wezeep.api.dto.CreateMoneyRequestRequest;
import com.wezeep.api.dto.MoneyRequestResponse;
import com.wezeep.domain.model.Contact;
import com.wezeep.domain.model.MoneyRequest;
import com.wezeep.domain.model.User;
import com.wezeep.domain.repository.ContactRepository;
import com.wezeep.domain.repository.MoneyRequestRepository;
import com.wezeep.domain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MoneyRequestService {

    private final MoneyRequestRepository moneyRequestRepository;
    private final UserRepository userRepository;
    private final ContactRepository contactRepository;

    public MoneyRequestService(MoneyRequestRepository moneyRequestRepository, UserRepository userRepository, ContactRepository contactRepository) {
        this.moneyRequestRepository = moneyRequestRepository;
        this.userRepository = userRepository;
        this.contactRepository = contactRepository;
    }

    @Transactional
    public MoneyRequestResponse create(UUID requesterId, CreateMoneyRequestRequest dto) {
        User requester = userRepository.findById(requesterId).orElseThrow(() -> new RuntimeException("User not found"));
        User recipient = userRepository.findById(dto.getRecipientId()).orElseThrow(() -> new RuntimeException("Recipient not found"));

        MoneyRequest request = MoneyRequest.builder()
                .requester(requester)
                .recipient(recipient)
                .fixedAmount(dto.getAmount())
                .currency(dto.getCurrency())
                .isFixedAmount(dto.getIsFixedAmount() != null ? dto.getIsFixedAmount() : true)
                .notes(dto.getNotes())
                .status(MoneyRequest.MoneyRequestStatus.PENDING)
                .shareableLink("https://wezeep.app/request/" + UUID.randomUUID())
                .build();
        if (!Boolean.TRUE.equals(dto.getIsFixedAmount())) {
            request.setExpiresAt(Instant.now().plusSeconds(7 * 24 * 3600)); // 7 days
        }
        request = moneyRequestRepository.save(request);
        return mapToResponse(request);
    }

    public List<MoneyRequestResponse> getSent(UUID userId) {
        return moneyRequestRepository.findByRequesterIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<MoneyRequestResponse> getReceived(UUID userId) {
        return moneyRequestRepository.findByRecipientIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MoneyRequestResponse fulfill(UUID userId, UUID requestId) {
        MoneyRequest request = moneyRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Money request not found"));
        if (!request.getRecipient().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        request.markAsCompleted();
        request = moneyRequestRepository.save(request);
        return mapToResponse(request);
    }

    public MoneyRequestResponse getById(UUID requestId, UUID userId) {
        MoneyRequest request = moneyRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Money request not found"));
        if (!request.getRequester().getId().equals(userId) && !request.getRecipient().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        return mapToResponse(request);
    }

    private UUID resolveRecipientUserId(CreateMoneyRequestRequest dto) {
        if (dto.getRecipientId() != null) return dto.getRecipientId();
        if (dto.getContactId() != null) {
            Contact contact = contactRepository.findById(dto.getContactId()).orElseThrow(() -> new RuntimeException("Contact not found"));
            if (contact.getWezeepId() == null || contact.getWezeepId().isBlank()) throw new RuntimeException("Contact is not a Wezeep user");
            return userRepository.findByWezeepId(contact.getWezeepId()).orElseThrow(() -> new RuntimeException("Recipient Wezeep user not found")).getId();
        }
        throw new RuntimeException("Either recipientId or contactId is required");
    }

    private MoneyRequestResponse mapToResponse(MoneyRequest r) {
        return MoneyRequestResponse.builder()
                .id(r.getId())
                .requesterId(r.getRequester().getId())
                .requesterName(r.getRequester().getFirstName() + " " + r.getRequester().getLastName())
                .requesterWezeepId(r.getRequester().getWezeepId())
                .recipientId(r.getRecipient().getId())
                .recipientName(r.getRecipient().getFirstName() + " " + r.getRecipient().getLastName())
                .recipientWezeepId(r.getRecipient().getWezeepId())
                .amount(r.getFixedAmount())
                .currency(r.getCurrency())
                .isFixedAmount(r.getIsFixedAmount())
                .notes(r.getNotes())
                .status(r.getStatus())
                .createdAt(r.getCreatedAt())
                .expiresAt(r.getExpiresAt())
                .completedAt(r.getCompletedAt())
                .shareableLink(r.getShareableLink())
                .build();
    }
}
