package com.skillverse.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "reported_user_id")
    private User reportedUser;

    @NotNull
    @Column(length = 2000)
    private String reason;

    @NotNull
    private LocalDateTime createdAt = LocalDateTime.now();
}