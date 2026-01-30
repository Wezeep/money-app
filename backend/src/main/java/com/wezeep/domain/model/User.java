package com.wezeep.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_users_email", columnList = "email", unique = true),
    @Index(name = "idx_users_phone", columnList = "phoneNumber", unique = true),
    @Index(name = "idx_users_wezeep_id", columnList = "wezeepId", unique = true)
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Phone number is required")
    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(length = 255)
    private String password;

    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String lastName;

    @NotBlank(message = "Wezeep ID is required")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Wezeep ID must be alphanumeric")
    @Size(max = 50, message = "Wezeep ID must not exceed 50 characters")
    @Column(nullable = false, unique = true, length = 50)
    private String wezeepId;

    @NotBlank(message = "Home country is required")
    @Pattern(regexp = "^[A-Z]{2}$", message = "Home country must be a valid ISO 3166-1 alpha-2 code")
    @Column(nullable = false, length = 2)
    private String homeCountry;

    @NotNull(message = "Preferred currency is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PreferredCurrency preferredCurrency = PreferredCurrency.USD;

    @Column(nullable = false)
    @Builder.Default
    private Boolean privacyToggleEnabled = false;

    @Column(nullable = false)
    @Builder.Default
    private Integer sessionExpiryDays = 45;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    @Column(nullable = false)
    @Builder.Default
    private Instant lastActivityAt = Instant.now();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Wallet> wallets = new ArrayList<>();

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Transaction> sentTransactions = new ArrayList<>();

    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Transaction> receivedTransactions = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PaymentMethod> paymentMethods = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Contact> contacts = new ArrayList<>();

    @OneToMany(mappedBy = "requester", cascade = CascadeType.ALL)
    @Builder.Default
    private List<MoneyRequest> sentMoneyRequests = new ArrayList<>();

    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL)
    @Builder.Default
    private List<MoneyRequest> receivedMoneyRequests = new ArrayList<>();

    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL)
    @Builder.Default
    private List<SplitBill> createdSplitBills = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @Builder.Default
    private List<SplitBillParticipant> splitBillParticipants = new ArrayList<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private RewardAccount rewardAccount;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SocialAuth> socialAuths = new ArrayList<>();

    @OneToMany(mappedBy = "referrer", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Referral> referrals = new ArrayList<>();

    @OneToOne(mappedBy = "referredUser", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Referral referredBy;

    @Column(length = 50)
    private String referralCode;

    @Column(nullable = false)
    @Builder.Default
    private Boolean profileCompleted = false;

    public enum PreferredCurrency {
        USD, LOCAL_CURRENCY
    }

    public void updateLastActivity() {
        this.lastActivityAt = Instant.now();
    }
}
