package com.skillverse.dto;
import java.math.BigDecimal;
import com.skillverse.model.enums.BookingStatus;
import java.time.LocalDateTime;

public class BookingDtos {

    // The request DTO we already have
    public record CreateBookingRequest(Long listingId) {}

    // The NEW response DTO we will return to the frontend
    public record BookingResponseDto(
            Long id,
            Long listingId,
            String listingTitle,
            Long learnerId,
            String learnerName,
            Long teacherId,
            String teacherName,
            BigDecimal tokenPrice,
            BookingStatus status,
            LocalDateTime bookingTime,
            String sessionRoomId
    ) {}
}