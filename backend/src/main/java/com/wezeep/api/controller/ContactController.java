package com.wezeep.api.controller;

import com.wezeep.domain.model.Contact;
import com.wezeep.domain.model.User;
import com.wezeep.domain.repository.ContactRepository;
import com.wezeep.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactRepository contactRepository;

    public ContactController(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @GetMapping
    public ResponseEntity<List<Contact>> getContacts(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Contact> contacts = contactRepository.findByUser_IdOrderByLastUsedAtDesc(userPrincipal.getId());
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Contact>> getRecentContacts(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Contact> contacts = contactRepository.findFirst3ByUser_IdOrderByLastUsedAtDesc(userPrincipal.getId());
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Contact>> searchContacts(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) Boolean wezeepUsersOnly) {
        List<Contact> contacts;
        
        if (query != null && !query.isEmpty()) {
            contacts = contactRepository.searchContacts(userPrincipal.getId(), query);
        } else {
            contacts = contactRepository.findByUser_IdOrderByLastUsedAtDesc(userPrincipal.getId());
        }
        
        // Filter by country if provided
        if (country != null && !country.isEmpty()) {
            // This would require joining with User table - simplified for now
            contacts = contacts.stream()
                    .filter(c -> c.getWezeepId() != null) // Wezeep users have wezeepId
                    .collect(java.util.stream.Collectors.toList());
        }
        
        // Filter Wezeep users only
        if (wezeepUsersOnly != null && wezeepUsersOnly) {
            contacts = contacts.stream()
                    .filter(c -> c.getWezeepId() != null && !c.getWezeepId().isEmpty())
                    .collect(java.util.stream.Collectors.toList());
        }
        
        return ResponseEntity.ok(contacts);
    }

    @PostMapping
    public ResponseEntity<Contact> createContact(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody Contact contact) {
        contact.setUser(User.builder().id(userPrincipal.getId()).build());
        Contact saved = contactRepository.save(contact);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id,
            @Valid @RequestBody Contact contact) {
        Contact existing = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        
        if (!existing.getUser().getId().equals(userPrincipal.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        existing.setFirstName(contact.getFirstName());
        existing.setLastName(contact.getLastName());
        existing.setWezeepId(contact.getWezeepId());
        existing.setPhoneNumber(contact.getPhoneNumber());
        existing.setEmail(contact.getEmail());
        existing.setAvatarUrl(contact.getAvatarUrl());

        Contact updated = contactRepository.save(existing);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        
        if (!contact.getUser().getId().equals(userPrincipal.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        contactRepository.delete(contact);
        return ResponseEntity.noContent().build();
    }
}
