package com.skillverse.model.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notifications_user_unread", columnList = "user_id,readAt"),
        @Index(name = "idx_notifications_createdAt", columnList = "createdAt")
})
public class Notification {

    public enum Type {
        MESSAGE, BOOKING_ACCEPTED, BOOKING_REJECTED, BOOKING_COMPLETED, ESCROW_RELEASED, DISPUTE_OPENED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 64)
    private Type type;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(nullable = false, length = 2000)
    private String body;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant readAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_user_id")
    private User fromUser;

    @Column(length = 4000)
    private String metadataJson;

    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getReadAt() {
        return readAt;
    }

    public void setReadAt(Instant readAt) {
        this.readAt = readAt;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public User getFromUser() {
        return fromUser;
    }

    public void setFromUser(User fromUser) {
        this.fromUser = fromUser;
    }

    public String getMetadataJson() {
        return metadataJson;
    }

    public void setMetadataJson(String metadataJson) {
        this.metadataJson = metadataJson;
    }

    // getters and setters omitted
}
