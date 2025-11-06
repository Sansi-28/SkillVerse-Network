package com.skillverse.dto;

import com.skillverse.dto.ListingDtos.ListingDto;
import com.skillverse.dto.UserDtos.PublicProfileDto;
import java.util.List;

public class SearchDtos {
    public record SearchResponseDto(
            List<PublicProfileDto> users,
            List<ListingDto> listings
    ) {}
}