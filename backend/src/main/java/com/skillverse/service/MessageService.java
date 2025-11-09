// backend/src/main/java/com/skillverse/service/MessageService.java
package com.skillverse.service;

import com.skillverse.dto.MessageDtos.MessageResponse;
import com.skillverse.dto.MessageDtos.SendRequest;
import com.skillverse.model.entity.Booking;
import com.skillverse.model.entity.Message;
import com.skillverse.model.entity.Notification;
import com.skillverse.model.entity.User;
import com.skillverse.repository.BookingRepository;
import com.skillverse.repository.MessageRepository;
import com.skillverse.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate; // Import the template
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate; // <-- ADDED: For sending WebSocket messages

    public MessageService(MessageRepository messageRepository,
                          UserRepository userRepository,
                          BookingRepository bookingRepository,
                          NotificationService notificationService,
                          SimpMessagingTemplate messagingTemplate) { // <-- ADDED
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
        this.messagingTemplate = messagingTemplate; // <-- ADDED
    }

    @Transactional
    public Message send(Long senderId, SendRequest req) {
        User sender = userRepository.findById(senderId).orElseThrow();
        User recipient = userRepository.findById(req.recipientId()).orElseThrow();
        Booking booking = (req.bookingId() != null)
                ? bookingRepository.findById(req.bookingId()).orElse(null)
                : null;
        String content = Optional.ofNullable(req.content()).map(String::trim).orElse("");
        if (content.isEmpty()) { throw new IllegalArgumentException("Message content cannot be empty."); }

        Message m = new Message();
        m.setSender(sender);
        m.setRecipient(recipient);
        m.setBooking(booking);
        m.setContent(content);
        Message savedMessage = messageRepository.save(m);

        // This creates the bell notification
        String snippet = content.length() > 100 ? content.substring(0, 100) + "..." : content;
        notificationService.create(recipient, Notification.Type.MESSAGE, "New message from " + sender.getName(), snippet, booking);

        // --- THE REAL-TIME FIX (BACKEND) ---
        // This pushes the full message object to the recipient's private WebSocket channel
        messagingTemplate.convertAndSendToUser(
                recipient.getEmail(),      // The user's principal name (their email)
                "/topic/messages",         // The private destination
                toDto(savedMessage)        // The message payload
        );
        // --- END OF FIX ---

        return savedMessage;
    }

    // ... other methods remain unchanged ...

    public List<Message> conversation(Long userA, Long userB) {
        String key = userA < userB ? (userA + ":" + userB) : (userB + ":" + userA);
        return messageRepository.findByConversationKeyOrderByCreatedAtAsc(key);
    }
    public List<Message> lastPerConversation(Long userId) { return messageRepository.findLastMessagesPerConversation(userId); }
    public long unreadCount(Long userId) { return messageRepository.countByRecipient_IdAndReadAtIsNull(userId); }
    @Transactional
    public void markRead(Long messageId, Long readerId) {
        Message m = messageRepository.findById(messageId).orElseThrow();
        if (Objects.equals(m.getRecipient().getId(), readerId) && m.getReadAt() == null) {
            m.setReadAt(LocalDateTime.now());
        }
    }
    public static MessageResponse toDto(Message m) {
        return new MessageResponse(m.getId(), m.getSender().getId(), m.getRecipient().getId(), m.getBooking() != null ? m.getBooking().getId() : null, m.getContent(), m.getCreatedAt(), m.getReadAt());
    }
}