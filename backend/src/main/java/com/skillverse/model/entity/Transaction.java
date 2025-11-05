package com.skillverse.model.entity;

import com.skillverse.model.enums.TransactionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @NotNull
    @Column(precision = 19, scale = 2)
    private BigDecimal amount;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking; // Link transaction to a booking

    private String description; // e.g., "Initial Grant", "Escrow for Booking #123"

    @NotNull
    private LocalDateTime createdAt = LocalDateTime.now();

    public Transaction(User user, TransactionType type, BigDecimal amount, Booking booking, String description) {
        this.user = user;
        this.type = type;
        this.amount = amount;
        this.booking = booking;
        this.description = description;
    }
}