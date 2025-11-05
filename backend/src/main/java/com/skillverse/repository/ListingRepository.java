package com.skillverse.repository;

import com.skillverse.model.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ListingRepository extends JpaRepository<Listing, Long> {
    List<Listing> findByTitleContainingIgnoreCase(String title);
}