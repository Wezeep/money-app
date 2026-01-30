package com.wezeep.api.dto;

import com.wezeep.domain.model.SocialAuth;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SocialLoginRequest {
    @NotBlank(message = "Provider is required")
    private String provider; // GOOGLE, FACEBOOK, APPLE
    
    @NotBlank(message = "Provider user ID is required")
    private String providerUserId;
    
    private String email;
    private String name;
    private String accessToken;
}
