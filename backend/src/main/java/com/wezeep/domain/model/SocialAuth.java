package com.wezeep.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "social_auths", indexes = {
    @Index(name = "idx_provider_id", columnList = "provider,providerUserId", unique = true),
    @Index(name = "idx_user", columnList = "userId")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialAuth {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @NotNull(message = "Provider is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SocialProvider provider;

    @NotBlank(message = "Provider user ID is required")
    @Column(nullable = false, length = 255)
    private String providerUserId;

    @Column(length = 500)
    private String email;

    @Column(length = 500)
    private String name;

    @Column(length = 1000)
    private String accessToken;

    @Column(length = 1000)
    private String refreshToken;

    @Column
    private Instant tokenExpiresAt;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    public enum SocialProvider {
        GOOGLE, FACEBOOK, APPLE
    }
}
