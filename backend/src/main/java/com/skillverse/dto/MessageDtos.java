// backend/src/main/java/com/skillverse/dto/MessageDtos.java
package com.skillverse.dto;

import java.time.LocalDateTime;

public class MessageDtos {
    public record SendRequest(Long recipientId, Long bookingId, String content) {}
    public record MessageResponse(
            Long id,
            Long senderId,
            Long recipientId,
            Long bookingId,
            String content,
            LocalDateTime createdAt,
            LocalDateTime readAt
    ) {}
}
