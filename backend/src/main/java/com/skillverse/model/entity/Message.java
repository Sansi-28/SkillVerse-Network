// backend/src/main/java/com/skillverse/model/entity/Message.java
package com.skillverse.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity(name = "Message")
@Table(name = "messages", indexes = {
        @Index(name = "idx_messages_conversation", columnList = "conversation_key"),
        @Index(name = "idx_messages_recipient_unread", columnList = "recipient_id,read_at"),
        @Index(name = "idx_messages_createdAt", columnList = "created_at")
})
public class Message {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id")
    private User recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(nullable = false, length = 2000)
    private String content;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "conversation_key", nullable = false, length = 64)
    private String conversationKey;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.sender == null || this.recipient == null) {
            throw new IllegalStateException("Sender and recipient are required");
        }
        long a = this.sender.getId();
        long b = this.recipient.getId();
        this.conversationKey = a < b ? (a + ":" + b) : (b + ":" + a);
    }

    public Long getId() { return id; }
    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }
    public User getRecipient() { return recipient; }
    public void setRecipient(User recipient) { this.recipient = recipient; }
    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }
    public String getConversationKey() { return conversationKey; }
    public void setConversationKey(String conversationKey) { this.conversationKey = conversationKey; }
}
