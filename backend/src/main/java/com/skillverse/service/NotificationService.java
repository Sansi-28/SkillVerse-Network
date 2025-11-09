package com.skillverse.service;

import com.skillverse.dto.NotificationDtos.NotificationResponse;
import com.skillverse.model.entity.Notification;
import com.skillverse.repository.NotificationRepository;
import com.skillverse.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Notification notifyMessage(Long toUserId, Long fromUserId, Long messageId, String snippet) {
        Notification n = new Notification();
        n.setUser(userRepository.findById(toUserId).orElseThrow());
        n.setFromUser(userRepository.findById(fromUserId).orElseThrow());
        n.setType(Notification.Type.MESSAGE);
        n.setTitle("New message");
        n.setBody(snippet != null && snippet.length() > 160 ? snippet.substring(0, 160) : String.valueOf(snippet));
        return notificationRepository.save(n);
    }

    public List<NotificationResponse> listForUser(Long userId) {
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId).stream()
                .map(n -> new NotificationResponse(
                        n.getId(),
                        n.getType().name(),
                        n.getTitle(),
                        n.getBody(),
                        n.getCreatedAt(),
                        n.getReadAt(),
                        n.getBooking() != null ? n.getBooking().getId() : null,
                        n.getFromUser() != null ? n.getFromUser().getId() : null
                ))
                .collect(Collectors.toList());
    }

    public long unreadCount(Long userId) {
        return notificationRepository.countByUser_IdAndReadAtIsNull(userId);
    }

    @Transactional
    public void markRead(Long id, Long ownerId) {
        Notification n = notificationRepository.findById(id).orElseThrow();
        if (!n.getUser().getId().equals(ownerId)) return;
        if (n.getReadAt() == null) n.setReadAt(java.time.Instant.now());
    }
}
