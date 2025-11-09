package com.skillverse.controller;

import com.skillverse.dto.MessageDtos.*;
import com.skillverse.model.entity.*;
import com.skillverse.repository.UserRepository;
import com.skillverse.service.MessageService;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final UserRepository userRepository;

    public MessageController(MessageService messageService, UserRepository userRepository) {
        this.messageService = messageService;
        this.userRepository = userRepository;
    }

    private Long currentUserId(Principal principal) {
        return userRepository.findByEmail(principal.getName()).orElseThrow().getId();
    }

    @PostMapping
    public ResponseEntity<MessageResponse> send(Principal principal, @RequestBody SendRequest req) {
        Long senderId = currentUserId(principal);
        Message saved = messageService.send(senderId, req);
        return ResponseEntity.ok(MessageService.toDto(saved));
    }

    @GetMapping("/with/{otherUserId}")
    public List<MessageResponse> conversation(Principal principal, @PathVariable Long otherUserId) {
        Long me = currentUserId(principal);
        return messageService.conversation(me, otherUserId).stream()
                .map(MessageService::toDto).collect(Collectors.toList());
    }

    @GetMapping("/conversations")
    public List<MessageResponse> lastPerConversation(Principal principal) {
        Long me = currentUserId(principal);
        return messageService.lastPerConversation(me).stream()
                .map(MessageService::toDto).collect(Collectors.toList());
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unreadCount(Principal principal) {
        Long me = currentUserId(principal);
        return Map.of("count", messageService.unreadCount(me));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markRead(Principal principal, @PathVariable Long id) {
        Long me = currentUserId(principal);
        messageService.markRead(id, me);
        return ResponseEntity.ok().build();
    }
}
