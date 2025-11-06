package com.skillverse.service;

import com.skillverse.dto.SearchDtos.SearchResponseDto;
import com.skillverse.model.entity.Listing;
import com.skillverse.model.entity.User;
import com.skillverse.repository.ListingRepository;
import com.skillverse.repository.UserRepository;
// You'll need to import your DTOs here
import com.skillverse.dto.ListingDtos.ListingDto;
import com.skillverse.dto.UserDtos.PublicProfileDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {

    @Autowired private UserRepository userRepository;
    @Autowired private ListingRepository listingRepository;

    public SearchResponseDto search(String query) {
        List<User> users = userRepository.findByNameContainingIgnoreCase(query);
        List<Listing> listings = listingRepository.findByTitleContainingIgnoreCase(query);

        List<PublicProfileDto> userDtos = users.stream().map(this::mapToPublicProfileDto).collect(Collectors.toList());
        List<ListingDto> listingDtos = listings.stream().map(this::mapToListingDto).collect(Collectors.toList());

        return new SearchResponseDto(userDtos, listingDtos);
    }

    private PublicProfileDto mapToPublicProfileDto(User user) {
        return new PublicProfileDto(user.getId(), user.getName(), user.getBio(), user.getAvatarUrl(), user.getSkillsOffered(), user.getSkillsWanted());
    }

    private ListingDto mapToListingDto(Listing listing) {
        return new ListingDto(listing.getId(), listing.getTitle(), listing.getDescription(), listing.getTokenPrice(), listing.getTeacher().getId(), listing.getTeacher().getName());
    }
}