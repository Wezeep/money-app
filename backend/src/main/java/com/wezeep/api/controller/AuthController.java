package com.wezeep.api.controller;

import com.wezeep.api.dto.AuthRequest;
import com.wezeep.api.dto.AuthResponse;
import com.wezeep.api.dto.RegisterRequest;
import com.wezeep.domain.model.User;
import com.wezeep.domain.repository.UserRepository;
import com.wezeep.security.JwtTokenProvider;
import com.wezeep.security.UserPrincipal;
import com.wezeep.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtTokenProvider tokenProvider,
            UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        User user = userService.register(request);

        String accessToken = tokenProvider.generateToken(user.getId(), user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId(), user.getEmail());

        AuthResponse response = AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .wezeepId(user.getWezeepId())
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.updateLastActivity();
        userRepository.save(user);

        String accessToken = tokenProvider.generateToken(user.getId(), user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId(), user.getEmail());

        AuthResponse response = AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .wezeepId(user.getWezeepId())
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String refreshToken) {
        if (!tokenProvider.isTokenExpired(refreshToken)) {
            UUID userId = tokenProvider.getUserIdFromToken(refreshToken);
            String email = tokenProvider.getEmailFromToken(refreshToken);

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String newAccessToken = tokenProvider.generateToken(user.getId(), user.getEmail());
            String newRefreshToken = tokenProvider.generateRefreshToken(user.getId(), user.getEmail());

            AuthResponse response = AuthResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .userId(user.getId())
                    .email(user.getEmail())
                    .wezeepId(user.getWezeepId())
                    .build();

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().build();
    }
}
