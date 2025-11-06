package com.skillverse.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {
    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
    public record SignUpRequest(@NotBlank @Size(min = 3) String name, @NotBlank @Email String email, @NotBlank @Size(min = 6) String password) {}
    public record JwtAuthenticationResponse(String accessToken) {}
}