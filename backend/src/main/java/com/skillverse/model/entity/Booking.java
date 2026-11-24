package com.skillverse.model.entity;

import com.skillverse.model.enums.BookingStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "bookings")
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

    @Column(unique = true)
    private String sessionRoomId;

    public Booking() {}

    @PrePersist
    protected void onCreate() {
        if (this.sessionRoomId == null) {
            this.sessionRoomId = UUID.randomUUID().toString();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getLearner() {
        return learner;
    }

    public void setLearner(User learner) {
        this.learner = learner;
    }

    public Listing getListing() {
        return listing;
    }

    public void setListing(Listing listing) {
        this.listing = listing;
    }

    public LocalDateTime getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(LocalDateTime bookingTime) {
        this.bookingTime = bookingTime;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getSessionRoomId() {
        return sessionRoomId;
    }

    public void setSessionRoomId(String sessionRoomId) {
        this.sessionRoomId = sessionRoomId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Booking booking = (Booking) o;
        return Objects.equals(id, booking.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
