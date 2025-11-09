package com.skillverse.service;

import com.skillverse.exception.InsufficientFundsException;
import com.skillverse.exception.InvalidOperationException;
import com.skillverse.exception.ResourceNotFoundException;
import com.skillverse.model.entity.*;
import com.skillverse.model.enums.BookingStatus;
import com.skillverse.model.enums.TransactionType;
import com.skillverse.repository.BookingRepository;
import com.skillverse.repository.ListingRepository;
import com.skillverse.repository.TransactionRepository;
import com.skillverse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired private NotificationService notificationService;
    @Autowired private AvailabilityService availabilityService;

    @Transactional
    public Booking createBookingFromSlot(String learnerEmail, Long slotId, Long listingId) {
        User learner = userRepository.findByEmail(learnerEmail).orElseThrow(() -> new ResourceNotFoundException("User", "email", learnerEmail));
        Listing listing = listingRepository.findById(listingId).orElseThrow(() -> new ResourceNotFoundException("Listing", "id", listingId));
        AvailabilitySlot slot = availabilityService.requireOpenSlot(slotId);

        if (!listing.getTeacher().getId().equals(slot.getTeacher().getId())) {
            throw new InvalidOperationException("This listing does not belong to the teacher who owns the availability slot.");
        }
        if (learner.getId().equals(listing.getTeacher().getId())) {
            throw new InvalidOperationException("You cannot book your own listing.");
        }

        availabilityService.markReserved(slot);

        Booking booking = new Booking();
        booking.setLearner(learner);
        booking.setListing(listing);
        booking.setBookingTime(slot.getStartTime());
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);

        notificationService.create(
                listing.getTeacher(),
                Notification.Type.BOOKING_REQUESTED, // <-- THE FIX
                "New Booking Request",
                learner.getName() + " requested your available slot for the session: " + listing.getTitle(),
                savedBooking
        );

        return savedBooking;
    }

    @Transactional
    public Booking createBookingRequest(Long listingId, String learnerEmail) {
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

        Booking savedBooking = bookingRepository.save(booking);

        notificationService.create(
                listing.getTeacher(),
                Notification.Type.BOOKING_REQUESTED, // <-- THE FIX
                "New Booking Request",
                learner.getName() + " wants to book your session: " + listing.getTitle(),
                savedBooking
        );

        return savedBooking;
    }

    @Transactional
    public Booking acceptBooking(Long bookingId, String teacherEmail) {
        User teacher = userRepository.findByEmail(teacherEmail).orElseThrow(() -> new ResourceNotFoundException("User", "email", teacherEmail));
        Booking booking = findAndValidateBookingForTeacher(bookingId, teacher.getId(), BookingStatus.PENDING);

        User learner = booking.getLearner();
        BigDecimal price = booking.getListing().getTokenPrice();
        User escrowUser = userRepository.findByEmail("escrow@system.internal").orElseThrow(() -> new IllegalStateException("Escrow user not found!"));

        if (learner.getTokenBalance().compareTo(price) < 0) {
            booking.setStatus(BookingStatus.REJECTED);
            Booking savedBooking = bookingRepository.save(booking);
            notificationService.create(
                    learner,
                    Notification.Type.BOOKING_REJECTED, // <-- THE FIX
                    "Booking Rejected",
                    "Your request for '" + booking.getListing().getTitle() + "' was rejected due to insufficient funds.",
                    savedBooking
            );
            throw new InsufficientFundsException("Learner does not have enough tokens. Booking rejected.");
        }

        learner.setTokenBalance(learner.getTokenBalance().subtract(price));
        transactionRepository.save(new Transaction(learner, TransactionType.DEBIT, price, booking, "Escrow for Booking #" + bookingId));

        escrowUser.setTokenBalance(escrowUser.getTokenBalance().add(price));
        transactionRepository.save(new Transaction(escrowUser, TransactionType.CREDIT, price, booking, "Escrow for Booking #" + bookingId));

        userRepository.save(learner);
        userRepository.save(escrowUser);

        booking.setStatus(BookingStatus.CONFIRMED);
        Booking savedBooking = bookingRepository.save(booking);

        notificationService.create(
                learner,
                Notification.Type.BOOKING_ACCEPTED, // <-- THE FIX
                "Booking Accepted!",
                teacher.getName() + " has accepted your request for '" + booking.getListing().getTitle() + "'.",
                savedBooking
        );

        return savedBooking;
    }

    @Transactional
    public Booking rejectBooking(Long bookingId, String teacherEmail) {
        User teacher = userRepository.findByEmail(teacherEmail).orElseThrow(() -> new ResourceNotFoundException("User", "email", teacherEmail));
        Booking booking = findAndValidateBookingForTeacher(bookingId, teacher.getId(), BookingStatus.PENDING);
        booking.setStatus(BookingStatus.REJECTED);

        Booking savedBooking = bookingRepository.save(booking);
        notificationService.create(
                booking.getLearner(),
                Notification.Type.BOOKING_REJECTED, // <-- THE FIX
                "Booking Rejected",
                teacher.getName() + " has rejected your request for '" + booking.getListing().getTitle() + "'.",
                savedBooking
        );
        return savedBooking;
    }

    @Transactional
    public Booking completeBooking(Long bookingId, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if(!booking.getLearner().getId().equals(user.getId()) && !booking.getListing().getTeacher().getId().equals(user.getId())) {
            throw new InvalidOperationException("You are not part of this booking.");
        }
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new InvalidOperationException("This booking cannot be completed in its current state.");
        }

        releaseFunds(booking);
        booking.setStatus(BookingStatus.COMPLETED);
        Booking savedBooking = bookingRepository.save(booking);

        notificationService.create(
                booking.getListing().getTeacher(),
                Notification.Type.BOOKING_COMPLETED, // <-- THE FIX
                "Session Completed & Funds Released",
                "Your session with " + booking.getLearner().getName() + " is complete. " + booking.getListing().getTokenPrice() + " tokens have been added.",
                savedBooking
        );
        notificationService.create(
                booking.getLearner(),
                Notification.Type.BOOKING_COMPLETED, // <-- THE FIX
                "Session Complete!",
                "How was your session for '" + booking.getListing().getTitle() + "'? Please consider leaving a review.",
                savedBooking
        );

        return savedBooking;
    }

    @Transactional
    public Booking openDispute(Long bookingId, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        boolean isLearner = booking.getLearner().getId().equals(user.getId());
        boolean isTeacher = booking.getListing().getTeacher().getId().equals(user.getId());

        if (!isLearner && !isTeacher) {
            throw new InvalidOperationException("You are not authorized to modify this booking.");
        }
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new InvalidOperationException("Only a confirmed booking can be disputed.");
        }

        booking.setStatus(BookingStatus.IN_DISPUTE);
        Booking savedBooking = bookingRepository.save(booking);

        User otherParty = isLearner ? booking.getListing().getTeacher() : booking.getLearner();
        notificationService.create(
                otherParty,
                Notification.Type.DISPUTE_OPENED, // <-- THE FIX
                "Booking Disputed",
                user.getName() + " has opened a dispute for the session: '" + booking.getListing().getTitle() + "'. An admin will review it.",
                savedBooking
        );

        return savedBooking;
    }

    @Transactional
    public void autoReleaseEscrow() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(48);
        List<Booking> bookingsToRelease = bookingRepository.findAllByStatusAndBookingTimeBefore(BookingStatus.CONFIRMED, threshold);

        for (Booking booking : bookingsToRelease) {
            releaseFunds(booking);
            booking.setStatus(BookingStatus.COMPLETED);
            bookingRepository.save(booking);

            notificationService.create(
                    booking.getLearner(),
                    Notification.Type.ESCROW_RELEASED, // <-- THE FIX
                    "Funds Auto-Released",
                    "Funds for '" + booking.getListing().getTitle() + "' were automatically released to the teacher after 48 hours.",
                    booking
            );
            notificationService.create(
                    booking.getListing().getTeacher(),
                    Notification.Type.ESCROW_RELEASED, // <-- THE FIX
                    "Funds Auto-Released",
                    booking.getListing().getTokenPrice() + " tokens for your session with " + booking.getLearner().getName() + " were automatically released.",
                    booking
            );
        }
    }

    private void releaseFunds(Booking booking) {
        BigDecimal price = booking.getListing().getTokenPrice();
        User teacher = booking.getListing().getTeacher();
        User escrowUser = userRepository.findByEmail("escrow@system.internal").orElseThrow(() -> new IllegalStateException("Escrow user not found!"));

        if (escrowUser.getTokenBalance().compareTo(price) < 0) {
            System.err.println("CRITICAL: Escrow has insufficient funds for booking " + booking.getId());
            return;
        }

        escrowUser.setTokenBalance(escrowUser.getTokenBalance().subtract(price));
        transactionRepository.save(new Transaction(escrowUser, TransactionType.DEBIT, price, booking, "Release funds for Booking #" + booking.getId()));

        teacher.setTokenBalance(teacher.getTokenBalance().add(price));
        transactionRepository.save(new Transaction(teacher, TransactionType.CREDIT, price, booking, "Payment for Booking #" + booking.getId()));

        userRepository.save(escrowUser);
        userRepository.save(teacher);
    }

    private Booking findAndValidateBookingForTeacher(Long bookingId, Long teacherId, BookingStatus expectedStatus) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));
        if (!booking.getListing().getTeacher().getId().equals(teacherId)) {
            throw new InvalidOperationException("You are not the teacher for this booking.");
        }
        if (booking.getStatus() != expectedStatus) {
            throw new InvalidOperationException("This booking cannot be modified in its current state.");
        }
        return booking;
    }

    public List<Booking> getSentRequests(String learnerEmail) { return bookingRepository.findByLearnerEmail(learnerEmail); }
    public List<Booking> getReceivedRequests(String teacherEmail) { return bookingRepository.findByListing_Teacher_Email(teacherEmail);}
}