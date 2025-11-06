package com.skillverse.dto;

import java.math.BigDecimal;

public class ListingDtos {
//    public record ListingDto(Long id, String title, String description, BigDecimal tokenPrice, Long teacherId, String teacherName) {}
    public record CreateListingRequest(String title, String description, BigDecimal tokenPrice, String format, int durationMinutes) {}
    public record ListingDto(
            Long id,
            String title,
            String description,
            BigDecimal tokenPrice,
            Long teacherId,
            String teacherName
    ) {}

    // A DTO for the price suggestion feature
    public record PriceSuggestionDto(
            double average,
            BigDecimal min,
            BigDecimal max,
            long count
    ) {}
}