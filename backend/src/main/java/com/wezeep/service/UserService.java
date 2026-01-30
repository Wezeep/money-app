package com.wezeep.service;

import com.wezeep.api.dto.RegisterRequest;
import com.wezeep.domain.model.User;
import com.wezeep.domain.model.Wallet;
import com.wezeep.domain.repository.UserRepository;
import com.wezeep.domain.repository.WalletRepository;
import com.wezeep.domain.repository.ReferralRepository;
import com.wezeep.domain.model.Referral;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReferralRepository referralRepository;

    public UserService(
            UserRepository userRepository, 
            WalletRepository walletRepository, 
            PasswordEncoder passwordEncoder,
            ReferralRepository referralRepository) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.passwordEncoder = passwordEncoder;
        this.referralRepository = referralRepository;
    }

    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists");
        }
        if (userRepository.existsByWezeepId(request.getWezeepId())) {
            throw new RuntimeException("Wezeep ID already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .wezeepId(request.getWezeepId())
                .homeCountry(request.getHomeCountry())
                .preferredCurrency(User.PreferredCurrency.USD)
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        // Generate referral code
        String referralCode = generateReferralCode(user.getWezeepId());
        user.setReferralCode(referralCode);

        user = userRepository.save(user);

        // Create referral record
        Referral referral = Referral.builder()
                .referrer(user)
                .referralCode(referralCode)
                .isCompleted(false)
                .pointsEarned(BigDecimal.ZERO)
                .build();
        referralRepository.save(referral);

        // Create default USD wallet
        Wallet wallet = Wallet.builder()
                .user(user)
                .currency("USD")
                .balance(BigDecimal.ZERO)
                .build();
        walletRepository.save(wallet);

        // Award profile completion points (if profile is complete)
        // This would be called after user completes their profile

        return user;
    }

    private String generateReferralCode(String wezeepId) {
        // Generate unique referral code based on Wezeep ID
        return "REF" + wezeepId.substring(0, Math.min(wezeepId.length(), 8)).toUpperCase();
    }
}
