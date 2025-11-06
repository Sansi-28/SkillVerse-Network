package com.skillverse.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Data
public class Listing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private User teacher;

    @NotNull
    private String title;

    @Column(length = 1000)
    private String description;

    @NotNull
    private String format; // E.g., "1:1 Mentorship", "Course", "Micro-Lesson"

    private Integer durationMinutes;

    @NotNull
    @Column(precision = 19, scale = 2)
    private BigDecimal tokenPrice;
}