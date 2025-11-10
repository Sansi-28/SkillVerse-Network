package com.skillverse.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class ReviewDtos {

    public record CreateReviewRequest(
            @NotNull Long bookingId,
            @NotNull @Min(1) @Max(5) Integer rating,
            @Size(max = 2000) String comment
    ) {}

    public record ReviewResponse(
            Long id,
            Long bookingId,
            Long reviewerId,
            String reviewerName,
            Long revieweeId,
            Integer rating,
            String comment,
            LocalDateTime createdAt
    ) {}
}