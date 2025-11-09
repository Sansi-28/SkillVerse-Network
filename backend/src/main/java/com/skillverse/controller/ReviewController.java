package com.skillverse.controller;

import com.skillverse.dto.ReviewDtos;
import com.skillverse.exception.InvalidOperationException;
import com.skillverse.exception.ResourceNotFoundException;
import com.skillverse.model.entity.Booking;
import com.skillverse.model.entity.Review;
import com.skillverse.model.entity.User;
import com.skillverse.model.enums.BookingStatus;
import com.skillverse.repository.BookingRepository;
import com.skillverse.repository.ReviewRepository;
import com.skillverse.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.skillverse.dto.ReviewDtos.ReviewResponse;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@Valid @RequestBody ReviewDtos.CreateReviewRequest request, Authentication authentication) {
        String reviewerEmail = authentication.getName();
        User reviewer = userRepository.findByEmail(reviewerEmail).orElseThrow(() -> new ResourceNotFoundException("User", "email", reviewerEmail));

        Booking booking = bookingRepository.findById(request.bookingId()).orElseThrow(() -> new ResourceNotFoundException("Booking", "id", request.bookingId()));

        // Validations
        if (!booking.getLearner().getId().equals(reviewer.getId())) {
            throw new InvalidOperationException("Only the learner can review this session.");
        }
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new InvalidOperationException("You can only review completed sessions.");
        }
        if (reviewRepository.existsByBookingIdAndReviewerId(booking.getId(), reviewer.getId())) {
            throw new InvalidOperationException("You have already reviewed this session.");
        }

        User reviewee = booking.getListing().getTeacher();

        Review review = new Review();
        review.setBooking(booking);
        review.setReviewer(reviewer);
        review.setReviewee(reviewee);
        review.setRating(request.rating());
        review.setComment(request.comment());

        Review savedReview = reviewRepository.save(review);
        return new ResponseEntity<>(mapToResponse(savedReview), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsForUser(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        List<Review> reviews = reviewRepository.findByRevieweeId(userId);
        return ResponseEntity.ok(reviews.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    private ReviewResponse mapToResponse(Review review) {
        return new ReviewDtos.ReviewResponse(
                review.getId(),
                review.getBooking().getId(),
                review.getReviewer().getId(),
                review.getReviewer().getName(),
                review.getReviewee().getId(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}