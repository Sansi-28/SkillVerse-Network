package com.skillverse.service;

import com.skillverse.exception.InsufficientFundsException;
import com.skillverse.exception.InvalidOperationException;
import com.skillverse.exception.ResourceNotFoundException;
import com.skillverse.model.entity.Booking;
import com.skillverse.model.entity.Listing;
import com.skillverse.model.entity.Transaction;
import com.skillverse.model.entity.User;
import com.skillverse.model.enums.BookingStatus;
import com.skillverse.model.enums.TransactionType;
import com.skillverse.repository.BookingRepository;
import com.skillverse.repository.ListingRepository;
import com.skillverse.repository.TransactionRepository;
import com.skillverse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private ListingRepository listingRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TransactionRepository transactionRepository;

    // createBookingRequest remains the same, no changes needed.
    @Transactional
    public Booking createBookingRequest(Long listingId, String learnerEmail) {
        // ... same code as before ...
        User learner = userRepository.findByEmail(learnerEmail).orElseThrow(() -> new ResourceNotFoundException("User", "email", learnerEmail));
        Listing listing = listingRepository.findById(listingId).orElseThrow(() -> new ResourceNotFoundException("Listing", "id", listingId));
        if (learner.getId().equals(listing.getTeacher().getId())) {
            throw new InvalidOperationException("You cannot book your own listing.");
        }
        Booking booking = new Booking();
        booking.setLearner(learner);
        booking.setListing(listing);
        booking.setStatus(BookingStatus.PENDING);
        booking.setBookingTime(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    // --- ESCROW LOGIC STARTS HERE ---

    // Teacher accepts -> Tokens move from Learner to Escrow
    @Transactional
    public Booking acceptBooking(Long bookingId, String teacherEmail) {
        User teacher = userRepository.findByEmail(teacherEmail).orElseThrow(() -> new ResourceNotFoundException("User", "email", teacherEmail));
        Booking booking = findAndValidateBooking(bookingId, teacher.getId(), BookingStatus.PENDING);

        User learner = booking.getLearner();
        BigDecimal price = booking.getListing().getTokenPrice();
        User escrowUser = userRepository.findByEmail("escrow@system.internal").orElseThrow(() -> new IllegalStateException("Escrow user not found!"));

        if (learner.getTokenBalance().compareTo(price) < 0) {
            booking.setStatus(BookingStatus.REJECTED);
            bookingRepository.save(booking);
            throw new InsufficientFundsException("Learner does not have enough tokens. Booking rejected.");
        }

        // --- Create Transactions ---
        // 1. Debit Learner
        learner.setTokenBalance(learner.getTokenBalance().subtract(price));
        transactionRepository.save(new Transaction(learner, TransactionType.DEBIT, price, booking, "Escrow for Booking #" + bookingId));

        // 2. Credit Escrow
        escrowUser.setTokenBalance(escrowUser.getTokenBalance().add(price));
        transactionRepository.save(new Transaction(escrowUser, TransactionType.CREDIT, price, booking, "Escrow for Booking #" + bookingId));

        userRepository.save(learner);
        userRepository.save(escrowUser);

        booking.setStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    // Learner marks as complete -> Tokens move from Escrow to Teacher
    @Transactional
    public Booking completeBooking(Long bookingId, String learnerEmail) {
        User learner = userRepository.findByEmail(learnerEmail).orElseThrow(() -> new ResourceNotFoundException("User", "email", learnerEmail));
        Booking booking = findAndValidateBooking(bookingId, learner.getId(), BookingStatus.CONFIRMED);

        // Release funds from escrow to teacher
        releaseFunds(booking);

        booking.setStatus(BookingStatus.COMPLETED);
        return bookingRepository.save(booking);
    }

    // rejectBooking remains mostly the same, no token logic needed.
    @Transactional
    public Booking rejectBooking(Long bookingId, String teacherEmail) {
        User teacher = userRepository.findByEmail(teacherEmail).orElseThrow(() -> new ResourceNotFoundException("User", "email", teacherEmail));
        Booking booking = findAndValidateBooking(bookingId, teacher.getId(), BookingStatus.PENDING);
        booking.setStatus(BookingStatus.REJECTED);
        return bookingRepository.save(booking);
    }

    // --- HELPER & SCHEDULED JOB ---

    // Shared private method for releasing funds
    private void releaseFunds(Booking booking) {
        BigDecimal price = booking.getListing().getTokenPrice();
        User teacher = booking.getListing().getTeacher();
        User escrowUser = userRepository.findByEmail("escrow@system.internal").orElseThrow(() -> new IllegalStateException("Escrow user not found!"));

        // 1. Debit Escrow
        escrowUser.setTokenBalance(escrowUser.getTokenBalance().subtract(price));
        transactionRepository.save(new Transaction(escrowUser, TransactionType.DEBIT, price, booking, "Release funds for Booking #" + booking.getId()));

        // 2. Credit Teacher
        teacher.setTokenBalance(teacher.getTokenBalance().add(price));
        transactionRepository.save(new Transaction(teacher, TransactionType.CREDIT, price, booking, "Payment for Booking #" + booking.getId()));

        userRepository.save(escrowUser);
        userRepository.save(teacher);
    }

    // Automated job to release funds for old, undisputed bookings
    @Scheduled(fixedRate = 3600000) // Runs every hour (3,600,000 milliseconds)
    @Transactional
    public void autoReleaseEscrow() {
        System.out.println("Running Auto-Release Escrow Job...");
        LocalDateTime threshold = LocalDateTime.now().minusHours(48);
        List<Booking> bookingsToRelease = bookingRepository.findAllByStatusAndBookingTimeBefore(BookingStatus.CONFIRMED, threshold);

        for (Booking booking : bookingsToRelease) {
            System.out.println("Auto-releasing funds for booking #" + booking.getId());
            releaseFunds(booking);
            booking.setStatus(BookingStatus.COMPLETED);
            bookingRepository.save(booking);
        }
    }

    // Helper to reduce code duplication for validation
    private Booking findAndValidateBooking(Long bookingId, Long userId, BookingStatus expectedStatus) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));
        boolean isLearner = booking.getLearner().getId().equals(userId);
        boolean isTeacher = booking.getListing().getTeacher().getId().equals(userId);

        if (!isLearner && !isTeacher) {
            throw new InvalidOperationException("You are not authorized to modify this booking.");
        }
        if (booking.getStatus() != expectedStatus) {
            throw new InvalidOperationException("This booking cannot be modified in its current state.");
        }
        return booking;
    }

    // ... getSentRequests and getReceivedRequests remain the same ...
    public List<Booking> getSentRequests(String learnerEmail) { return bookingRepository.findByLearnerEmail(learnerEmail); }
    public List<Booking> getReceivedRequests(String teacherEmail) { return bookingRepository.findByListing_Teacher_Email(teacherEmail);}
}