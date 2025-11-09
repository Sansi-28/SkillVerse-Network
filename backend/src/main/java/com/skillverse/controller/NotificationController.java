package com.skillverse.controller;

import com.skillverse.dto.NotificationDtos.NotificationResponse;
import com.skillverse.repository.UserRepository;
import com.skillverse.service.NotificationService;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService,
                                  UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    private Long currentUserId(Principal p) {
        return userRepository.findByEmail(p.getName()).orElseThrow().getId();
    }

    @GetMapping
    public List<NotificationResponse> list(Principal p) {
        return notificationService.listForUser(currentUserId(p));
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unread(Principal p) {
        return Map.of("count", notificationService.unreadCount(currentUserId(p)));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markRead(Principal p, @PathVariable Long id) {
        notificationService.markRead(id, currentUserId(p));
        return ResponseEntity.ok().build();
    }
}
