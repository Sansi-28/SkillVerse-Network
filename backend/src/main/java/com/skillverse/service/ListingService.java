package com.skillverse.service;


import com.skillverse.dto.ListingDtos.*;
import com.skillverse.exception.ResourceNotFoundException;
import com.skillverse.model.entity.Listing;
import com.skillverse.model.entity.User;
import com.skillverse.repository.ListingRepository;
import com.skillverse.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.skillverse.dto.ListingDtos.PriceSuggestionDto;
import java.math.BigDecimal;
import java.util.DoubleSummaryStatistics;

@Service
public class ListingService {

    @Autowired
    private ListingRepository listingRepository;
    @Autowired
    private UserRepository userRepository;

    public List<ListingDto> getAllListings() {
        return listingRepository.findAll().stream().map(this::mapToListingDto).collect(Collectors.toList());
    }

    public ListingDto getListingById(Long id) {
        Listing listing = listingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Listing", "id", id));
        return mapToListingDto(listing);
    }

    private ListingDto mapToListingDto(Listing listing) {
        return new ListingDto(
                listing.getId(),
                listing.getTitle(),
                listing.getDescription(),
                listing.getTokenPrice(),
                listing.getTeacher().getId(),
                listing.getTeacher().getName()
        );
    }
    public PriceSuggestionDto getPriceSuggestion(String skill) {
        List<Listing> listings = listingRepository.findByTitleContainingIgnoreCase(skill);
        DoubleSummaryStatistics stats = listings.stream()
                .mapToDouble(l -> l.getTokenPrice().doubleValue())
                .summaryStatistics();

        return new PriceSuggestionDto(
                stats.getCount() > 0 ? stats.getAverage() : 0.0,
                stats.getCount() > 0 ? BigDecimal.valueOf(stats.getMin()) : BigDecimal.ZERO,
                stats.getCount() > 0 ? BigDecimal.valueOf(stats.getMax()) : BigDecimal.ZERO,
                stats.getCount()
        );
    }

    @Transactional
    public Listing createListing(CreateListingRequest request, String userEmail) {
        User teacher = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Listing listing = new Listing();
        listing.setTitle(request.title());
        listing.setDescription(request.description());
        listing.setTokenPrice(request.tokenPrice());
        listing.setFormat(request.format()); // Assuming format and duration are in the DTO
        listing.setDurationMinutes(request.durationMinutes());
        listing.setTeacher(teacher);

        return listingRepository.save(listing);
    }

}
