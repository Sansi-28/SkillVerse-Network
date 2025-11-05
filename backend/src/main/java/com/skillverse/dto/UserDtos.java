package com.skillverse.dto;

import java.math.BigDecimal;
import java.util.List;

public class UserDtos {

    public record UserProfileDto(
            Long id,
            String name,
            String email,
            String bio,
            String avatarUrl,
            BigDecimal tokenBalance,
            List<String> skillsOffered,
            List<String> skillsWanted
    ) {}

    public record PublicProfileDto(
            Long id,
            String name,
            String bio,
            String avatarUrl,
            List<String> skillsOffered,
            List<String> skillsWanted
    ) {}

    public record UpdateProfileRequest(
            String name,
            String bio,
            List<String> skillsOffered,
            List<String> skillsWanted
    ) {}
}