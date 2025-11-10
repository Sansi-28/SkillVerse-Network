package com.skillverse.controller;

import com.skillverse.dto.BookingDtos.*;
import com.skillverse.model.entity.Booking;
import com.skillverse.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired private BookingService bookingService;

    // DTO for booking from a slot
    public record BookFromSlotRequest(Long slotId, Long listingId) {}

    @PostMapping("/from-slot")
    public ResponseEntity<BookingResponseDto> createFromSlot(Authentication authentication, @RequestBody BookFromSlotRequest req) {
        String learnerEmail = authentication.getName();
        Booking booking = bookingService.createBookingFromSlot(learnerEmail, req.slotId(), req.listingId());
        return ResponseEntity.ok(mapToBookingResponseDto(booking));
    }

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBookingRequest(@RequestBody CreateBookingRequest request, Authentication authentication) {
        String learnerEmail = authentication.getName();
        Booking booking = bookingService.createBookingRequest(request.listingId(), learnerEmail);
        return ResponseEntity.ok(mapToBookingResponseDto(booking));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<BookingResponseDto> acceptBookingRequest(@PathVariable Long id, Authentication authentication) {
        String teacherEmail = authentication.getName();
        Booking booking = bookingService.acceptBooking(id, teacherEmail);
        return ResponseEntity.ok(mapToBookingResponseDto(booking));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<BookingResponseDto> rejectBookingRequest(@PathVariable Long id, Authentication authentication) {
        String teacherEmail = authentication.getName();
        Booking booking = bookingService.rejectBooking(id, teacherEmail);
        return ResponseEntity.ok(mapToBookingResponseDto(booking));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<BookingResponseDto> completeBooking(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        Booking booking = bookingService.completeBooking(id, userEmail);
        return ResponseEntity.ok(mapToBookingResponseDto(booking));
    }

    @PostMapping("/{id}/dispute")
    public ResponseEntity<BookingResponseDto> disputeBooking(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        Booking booking = bookingService.openDispute(id, userEmail);
        return ResponseEntity.ok(mapToBookingResponseDto(booking));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<BookingResponseDto>> getSentRequests(Authentication authentication) {
        List<Booking> bookings = bookingService.getSentRequests(authentication.getName());
        List<BookingResponseDto> dtos = bookings.stream()
                .map(this::mapToBookingResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/received")
    public ResponseEntity<List<BookingResponseDto>> getReceivedRequests(Authentication authentication) {
        List<Booking> bookings = bookingService.getReceivedRequests(authentication.getName());
        List<BookingResponseDto> dtos = bookings.stream()
                .map(this::mapToBookingResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private BookingResponseDto mapToBookingResponseDto(Booking booking) {
        return new BookingResponseDto(
                booking.getId(),
                booking.getListing().getId(),
                booking.getListing().getTitle(),
                booking.getLearner().getId(),
                booking.getLearner().getName(),
                booking.getListing().getTeacher().getId(),
                booking.getListing().getTeacher().getName(),
                booking.getListing().getTokenPrice(),
                booking.getStatus(),
                booking.getBookingTime(),
                booking.getSessionRoomId()
        );
    }
}