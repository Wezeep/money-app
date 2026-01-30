package com.wezeep.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "contacts", indexes = {
    @Index(name = "idx_user", columnList = "userId"),
    @Index(name = "idx_wezeep_id", columnList = "wezeepId"),
    @Index(name = "idx_phone", columnList = "phoneNumber")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @Size(max = 100)
    @Column(length = 100)
    private String firstName;

    @Size(max = 100)
    @Column(length = 100)
    private String lastName;

    @Size(max = 50)
    @Column(length = 50)
    private String wezeepId;

    @Size(max = 20)
    @Column(length = 20)
    private String phoneNumber;

    @Size(max = 100)
    @Column(length = 100)
    private String email;

    @Size(max = 500)
    @Column(length = 500)
    private String avatarUrl;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    @Column(nullable = false)
    @Builder.Default
    private Instant lastUsedAt = Instant.now();

    public String getDisplayName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        } else if (firstName != null) {
            return firstName;
        } else if (wezeepId != null) {
            return wezeepId;
        } else if (phoneNumber != null) {
            return phoneNumber;
        }
        return "Unknown";
    }
}
