package com.skillverse.model.entity;

import com.skillverse.model.enums.BookingStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "learner_id")
    private User learner;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "listing_id")
    private Listing listing;

    @NotNull
    private LocalDateTime bookingTime;

    @NotNull
    @Enumerated(EnumType.STRING)
    private BookingStatus status;
}