package com.wezeep.service;

import com.wezeep.api.dto.AuthResponse;
import com.wezeep.domain.model.SocialAuth;
import com.wezeep.domain.model.User;
import com.wezeep.domain.repository.SocialAuthRepository;
import com.wezeep.domain.repository.UserRepository;
import com.wezeep.security.JwtTokenProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class SocialAuthService {

    private final SocialAuthRepository socialAuthRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    public SocialAuthService(
            SocialAuthRepository socialAuthRepository,
            UserRepository userRepository,
            JwtTokenProvider tokenProvider,
            UserService userService) {
        this.socialAuthRepository = socialAuthRepository;
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
        this.userService = userService;
    }

    @Transactional
    public AuthResponse authenticateWithSocial(
            SocialAuth.SocialProvider provider,
            String providerUserId,
            String email,
            String name) {
        
        // Check if social auth exists
        SocialAuth socialAuth = socialAuthRepository
                .findByProviderAndProviderUserId(provider, providerUserId)
                .orElse(null);

        User user;
        
        if (socialAuth != null) {
            // Existing user
            user = socialAuth.getUser();
        } else {
            // New user or linking account
            if (email != null) {
                user = userRepository.findByEmail(email).orElse(null);
            } else {
                user = null;
            }

            if (user == null) {
                // Create new user
                user = createUserFromSocialAuth(email, name);
            }

            // Create or update social auth
            socialAuth = SocialAuth.builder()
                    .user(user)
                    .provider(provider)
                    .providerUserId(providerUserId)
                    .email(email)
                    .name(name)
                    .build();
            socialAuthRepository.save(socialAuth);
        }

        user.updateLastActivity();
        userRepository.save(user);

        String accessToken = tokenProvider.generateToken(user.getId(), user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId(), user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .wezeepId(user.getWezeepId())
                .build();
    }

    private User createUserFromSocialAuth(String email, String name) {
        // Generate unique Wezeep ID
        String wezeepId = generateWezeepId();
        
        // Parse name
        String[] nameParts = name != null ? name.split(" ", 2) : new String[]{"User", ""};
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        User user = User.builder()
                .email(email)
                .phoneNumber("") // Will be updated later
                .firstName(firstName)
                .lastName(lastName)
                .wezeepId(wezeepId)
                .homeCountry("US") // Default, should be updated
                .preferredCurrency(User.PreferredCurrency.USD)
                .build();

        return userRepository.save(user);
    }

    private String generateWezeepId() {
        String prefix = "WZP";
        String random = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        return prefix + random;
    }
}
