package com.wezeep.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Phone number is required")
    private String phoneNumber;
    
    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;
    
    @NotBlank(message = "Wezeep ID is required")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Wezeep ID must be alphanumeric")
    @Size(max = 50, message = "Wezeep ID must not exceed 50 characters")
    private String wezeepId;
    
    @NotBlank(message = "Home country is required")
    @Pattern(regexp = "^[A-Z]{2}$", message = "Home country must be a valid ISO 3166-1 alpha-2 code")
    private String homeCountry;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}
