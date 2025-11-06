package com.skillverse.controller;


import com.skillverse.dto.ListingDtos.*;
import com.skillverse.model.entity.Listing;
import com.skillverse.service.ListingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.skillverse.dto.ListingDtos.*;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    @Autowired
    private ListingService listingService;

    @GetMapping
    public List<ListingDto> getAllListings() {
        return listingService.getAllListings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingDto> getListingById(@PathVariable Long id) {
        return ResponseEntity.ok(listingService.getListingById(id));
    }

    @PostMapping
    public ResponseEntity<Listing> createListing(@RequestBody CreateListingRequest request, Authentication authentication) {
        String userEmail = authentication.getName();
        Listing newListing = listingService.createListing(request, userEmail);
        return new ResponseEntity<>(newListing, HttpStatus.CREATED);
    }

    @GetMapping("/price-suggestion")
    public ResponseEntity<PriceSuggestionDto> getPriceSuggestion(@RequestParam("skill") String skill) {
        return ResponseEntity.ok(listingService.getPriceSuggestion(skill));
    }
}
