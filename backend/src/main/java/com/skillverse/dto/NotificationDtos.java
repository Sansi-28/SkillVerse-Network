package com.skillverse.dto;

import java.time.Instant;

public class NotificationDtos {
    public record NotificationResponse(Long id, String type, String title, String body,
                                       Instant createdAt, Instant readAt,
                                       Long bookingId, Long fromUserId) {}
}
