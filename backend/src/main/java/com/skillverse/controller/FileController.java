package com.skillverse.controller;

import com.skillverse.model.entity.User;
import com.skillverse.repository.UserRepository;
import com.skillverse.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
@RequestMapping("/api/files")
public class FileController {

    @Autowired private FileStorageService storageService;
    @Autowired private UserRepository userRepository;

    @PostMapping("/upload/avatar")
    @ResponseBody // Important: This makes it return JSON
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") MultipartFile file, Authentication authentication) {
        String fileUrl = storageService.save(file);

        // Update the user's avatarUrl in the database
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        user.setAvatarUrl(fileUrl);
        userRepository.save(user);

        return ResponseEntity.ok(fileUrl);
    }

    @GetMapping("/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        try {
            Path file = Paths.get("uploads").resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}