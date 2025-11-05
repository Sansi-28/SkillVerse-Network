package com.skillverse.controller;

import com.skillverse.dto.UserDtos.*;
import com.skillverse.exception.ResourceNotFoundException;
import com.skillverse.model.entity.User;
import com.skillverse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUserProfile(Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        return ResponseEntity.ok(mapToUserProfileDto(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicProfileDto> getUserProfileById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        return ResponseEntity.ok(mapToPublicProfileDto(user));
    }

    @PatchMapping("/me")
    public ResponseEntity<UserProfileDto> updateCurrentUserProfile(@RequestBody UpdateProfileRequest request, Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        if (request.name() != null) user.setName(request.name());
        if (request.bio() != null) user.setBio(request.bio());
        if (request.skillsOffered() != null) user.setSkillsOffered(request.skillsOffered());
        if (request.skillsWanted() != null) user.setSkillsWanted(request.skillsWanted());

        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(mapToUserProfileDto(updatedUser));
    }

    private UserProfileDto mapToUserProfileDto(User user) {
        return new UserProfileDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getBio(),
                user.getAvatarUrl(),
                user.getTokenBalance(),
                user.getSkillsOffered(),
                user.getSkillsWanted()
        );
    }

    private PublicProfileDto mapToPublicProfileDto(User user) {
        return new PublicProfileDto(
                user.getId(),
                user.getName(),
                user.getBio(),
                user.getAvatarUrl(),
                user.getSkillsOffered(),
                user.getSkillsWanted()
        );
    }
}