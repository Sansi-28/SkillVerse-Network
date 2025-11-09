// backend/src/main/java/com/skillverse/controller/AvailabilityBookingController.java
package com.skillverse.controller;

import com.skillverse.dto.BookingDtos.BookingResponseDto;
import com.skillverse.model.entity.AvailabilitySlot;
import com.skillverse.model.entity.Booking;
import com.skillverse.model.entity.Listing;
import com.skillverse.model.entity.User;
import com.skillverse.model.enums.BookingStatus;
import com.skillverse.repository.BookingRepository;
import com.skillverse.repository.ListingRepository;
import com.skillverse.repository.UserRepository;
import com.skillverse.service.AvailabilityService;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class AvailabilityBookingController {

    private final AvailabilityService availabilityService;
    private final BookingRepository bookings;
    private final ListingRepository listings;
    private final UserRepository users;

    public AvailabilityBookingController(AvailabilityService availabilityService,
                                         BookingRepository bookings,
                                         ListingRepository listings,
                                         UserRepository users) {
        this.availabilityService = availabilityService;
        this.bookings = bookings;
        this.listings = listings;
        this.users = users;
    }

    private Long me(Principal p) { return users.findByEmail(p.getName()).orElseThrow().getId(); }

    public record BookFromSlotRequest(Long slotId, Long listingId) {}

    @PostMapping("/from-slot")
    public ResponseEntity<BookingResponseDto> createFromSlot(Principal p, @RequestBody BookFromSlotRequest req) {
        Long learnerId = me(p);
        AvailabilitySlot slot = availabilityService.requireOpenSlot(req.slotId());
        Listing listing = listings.findById(req.listingId()).orElseThrow();

        if (!listing.getTeacher().getId().equals(slot.getTeacher().getId())) {
            return ResponseEntity.badRequest().build();
        }
        availabilityService.markReserved(slot);

        Booking b = new Booking();
        b.setLearner(users.findById(learnerId).orElseThrow());
        b.setListing(listing);
        b.setBookingTime(slot.getStartTime());
        b.setStatus(BookingStatus.PENDING);
        Booking saved = bookings.save(b);

        BookingResponseDto dto = new BookingResponseDto(
                saved.getId(),
                saved.getListing().getId(),
                saved.getListing().getTitle(),
                saved.getLearner().getId(),
                saved.getLearner().getName(),
                saved.getListing().getTeacher().getId(),
                saved.getListing().getTeacher().getName(),
                saved.getListing().getTokenPrice(),
                saved.getStatus(),
                saved.getBookingTime()
        );
        return ResponseEntity.ok(dto);
    }
}
