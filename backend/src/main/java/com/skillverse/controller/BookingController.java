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
        String learnerEmail = authentication.getName();
        Booking booking = bookingService.completeBooking(id, learnerEmail);
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


    // Helper method to map the Entity to our clean DTO
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
                booking.getBookingTime()
        );
    }
}