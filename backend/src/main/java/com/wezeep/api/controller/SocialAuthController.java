package com.wezeep.api.controller;

import com.wezeep.api.dto.AuthResponse;
import com.wezeep.api.dto.SocialLoginRequest;
import com.wezeep.domain.model.SocialAuth;
import com.wezeep.service.SocialAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/social")
public class SocialAuthController {

    private final SocialAuthService socialAuthService;

    public SocialAuthController(SocialAuthService socialAuthService) {
        this.socialAuthService = socialAuthService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> socialLogin(@Valid @RequestBody SocialLoginRequest request) {
        SocialAuth.SocialProvider provider = SocialAuth.SocialProvider.valueOf(request.getProvider().toUpperCase());
        
        AuthResponse response = socialAuthService.authenticateWithSocial(
                provider,
                request.getProviderUserId(),
                request.getEmail(),
                request.getName()
        );
        
        return ResponseEntity.ok(response);
    }
}
