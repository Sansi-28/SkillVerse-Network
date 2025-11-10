// backend/src/main/java/com/skillverse/service/EscrowService.java
package com.skillverse.service;

import com.skillverse.model.entity.*;
import com.skillverse.model.enums.BookingStatus;
import com.skillverse.repository.BookingRepository;
import com.skillverse.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EscrowService {

    private final BookingRepository bookings;
    private final TransactionRepository transactions;
    private final NotificationService notifications;

    public EscrowService(BookingRepository bookings,
                         TransactionRepository transactions,
                         NotificationService notifications) {
        this.bookings = bookings;
        this.transactions = transactions;
        this.notifications = notifications;
    }

    /**
     * NOTE: This method is currently redundant. The active scheduler
     * (@see BookingEscrowScheduler) calls the more complete auto-release logic
     * in BookingService. This method is maintained to resolve compilation but
     * should be considered for removal in a future refactor.
     */
    @Transactional
    public int autoRelease(Duration after) {
        Instant cutoff = Instant.now().minus(after);
        LocalDateTime cutoffDateTime = LocalDateTime.ofInstant(cutoff, java.time.ZoneId.systemDefault());

        List<Booking> eligible = bookings.findAllByStatusAndBookingTimeBefore(BookingStatus.CONFIRMED, cutoffDateTime);
        int count = 0;
        for (Booking b : eligible) {
            Listing listing = b.getListing();
            User learner = b.getLearner();
            User teacher = listing.getTeacher();

            b.setStatus(BookingStatus.COMPLETED);
            bookings.save(b);

            // Notify Teacher
            notifications.create(teacher,
                    Notification.Type.ESCROW_RELEASED, // <-- THE FIX: Added Notification.Type
                    "Funds Auto-Released",
                    "Funds for your session with " + learner.getName() + " were automatically released.",
                    b);

            // Notify Learner
            notifications.create(learner,
                    Notification.Type.ESCROW_RELEASED, // <-- THE FIX: Added Notification.Type
                    "Funds Auto-Released",
                    "Funds for your session with " + teacher.getName() + " were automatically released after 48 hours.",
                    b);
            count++;
        }
        return count;
    }
}