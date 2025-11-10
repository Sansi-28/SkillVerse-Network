package com.skillverse.service;

import com.skillverse.dto.NotificationDtos.NotificationResponse;
import com.skillverse.model.entity.Booking;
import com.skillverse.model.entity.Notification;
import com.skillverse.model.entity.User;
import com.skillverse.repository.NotificationRepository;
import com.skillverse.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

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
    public Notification create(User user, Notification.Type type, String title, String body, Booking booking) {
        Notification n = new Notification();
        n.setUser(user);
        n.setType(type); // <-- THE FIX: Set type directly
        n.setTitle(title);
        n.setBody(body);
        n.setBooking(booking);

        // Set the 'fromUser' if it can be inferred from the booking
        if (booking != null) {
            if (user.getId().equals(booking.getLearner().getId())) {
                n.setFromUser(booking.getListing().getTeacher());
            } else {
                n.setFromUser(booking.getLearner());
            }
        }

        return notificationRepository.save(n);
    }

    public List<NotificationResponse> listForUser(Long userId) {
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public long unreadCount(Long userId) {
        return notificationRepository.countByUser_IdAndReadAtIsNull(userId);
    }

    @Transactional
    public void markRead(Long id, Long ownerId) {
        Notification n = notificationRepository.findById(id).orElseThrow();
        if (!n.getUser().getId().equals(ownerId)) return;
        if (n.getReadAt() == null) n.setReadAt(Instant.now());
    }

    private NotificationResponse mapToResponse(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getType() != null ? n.getType().name() : "GENERAL",
                n.getTitle(),
                n.getBody(),
                n.getCreatedAt(),
                n.getReadAt(),
                n.getBooking() != null ? n.getBooking().getId() : null,
                n.getFromUser() != null ? n.getFromUser().getId() : null
        );
    }
}