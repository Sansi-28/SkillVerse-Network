// backend/src/main/java/com/skillverse/service/MessageService.java
package com.skillverse.service;

import com.skillverse.dto.MessageDtos.MessageResponse;
import com.skillverse.dto.MessageDtos.SendRequest;
import com.skillverse.model.entity.Booking;
import com.skillverse.model.entity.Message;
import com.skillverse.model.entity.User;
import com.skillverse.repository.BookingRepository;
import com.skillverse.repository.MessageRepository;
import com.skillverse.repository.UserRepository;
import jakarta.transaction.Transactional;
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

    public MessageService(MessageRepository messageRepository,
                          UserRepository userRepository,
                          BookingRepository bookingRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public Message send(Long senderId, SendRequest req) {
        User sender = userRepository.findById(senderId).orElseThrow();
        User recipient = userRepository.findById(req.recipientId()).orElseThrow();
        Booking booking = (req.bookingId() != null)
                ? bookingRepository.findById(req.bookingId()).orElse(null)
                : null;

        Message m = new Message();
        m.setSender(sender);
        m.setRecipient(recipient);
        m.setBooking(booking);
        m.setContent(Optional.ofNullable(req.content()).map(String::trim).orElse(""));
        m.setCreatedAt(LocalDateTime.now());
        return messageRepository.save(m);
    }

    public List<Message> conversation(Long userA, Long userB) {
        String key = userA < userB ? (userA + ":" + userB) : (userB + ":" + userA);
        return messageRepository.findByConversationKeyOrderByCreatedAtAsc(key);
    }

    public List<Message> lastPerConversation(Long userId) {
        return messageRepository.findLastMessagesPerConversation(userId);
    }

    public long unreadCount(Long userId) {
        return messageRepository.countByRecipient_IdAndReadAtIsNull(userId);
    }

    @Transactional
    public void markRead(Long messageId, Long readerId) {
        Message m = messageRepository.findById(messageId).orElseThrow();
        if (Objects.equals(m.getRecipient().getId(), readerId) && m.getReadAt() == null) {
            m.setReadAt(LocalDateTime.now());
        }
    }

    public static MessageResponse toDto(Message m) {
        return new MessageResponse(
                m.getId(),
                m.getSender().getId(),
                m.getRecipient().getId(),
                m.getBooking() != null ? m.getBooking().getId() : null,
                m.getContent(),
                m.getCreatedAt(),
                m.getReadAt()
        );
    }

    public List<MessageResponse> toDtoList(List<Message> list) {
        return list.stream().map(MessageService::toDto).collect(Collectors.toList());
    }
}
