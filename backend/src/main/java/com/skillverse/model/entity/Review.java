package com.skillverse.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @OneToOne
    @JoinColumn(name = "booking_id", unique = true)
    private Booking booking;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private User reviewer; // The learner

    @NotNull
    @ManyToOne
    @JoinColumn(name = "reviewee_id")
    private User reviewee; // The teacher

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating; // 1 to 5 stars

    @Column(length = 2000)
    private String comment;

    @NotNull
    private LocalDateTime createdAt = LocalDateTime.now();
}