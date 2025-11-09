// backend/src/main/java/com/skillverse/service/EscrowService.java
package com.skillverse.service;

import com.skillverse.model.entity.*;
import com.skillverse.model.entity.Booking;
import com.skillverse.model.entity.Listing;
import com.skillverse.model.entity.Transaction;
import com.skillverse.model.entity.User;
import com.skillverse.model.enums.BookingStatus;
import com.skillverse.model.enums.TransactionType;
import com.skillverse.repository.BookingRepository;
import com.skillverse.repository.TransactionRepository;
//import jakarta.transaction.Transaction;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Service;

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

    @Transactional
    public int autoRelease(Duration after) {
        Instant cutoff = Instant.now().minus(after);
        List<Booking> eligible = bookings.findAllByStatusAndBookingTimeBefore(BookingStatus.CONFIRMED, LocalDateTime.from(cutoff));
        int count = 0;
        for (Booking b : eligible) {
            Listing listing = b.getListing();
            User learner = b.getLearner();
            User teacher = listing.getTeacher();
            @NotNull BigDecimal amount = listing.getTokenPrice(); // adjust type if BigDecimal in your model

            // Create transactions
            Transaction debit = new Transaction();
            debit.setBooking(b);
            debit.setUser(learner);
            debit.setType(TransactionType.DEBIT);
            debit.setAmount(amount);
            debit.setCreatedAt(LocalDateTime.from(Instant.now()));
            transactions.save(debit);

            Transaction credit = new Transaction();
            credit.setBooking(b);
            credit.setUser(teacher);
            credit.setType(TransactionType.CREDIT);
            credit.setAmount(amount);
            credit.setCreatedAt(LocalDateTime.from(Instant.now()));
            transactions.save(credit);

            // Update booking status
            b.setStatus(BookingStatus.COMPLETED);

            // Notify
            notifications.notifyMessage(teacher.getId(), learner.getId(), null,
                    "Escrow released for your session; tokens credited.");
            notifications.notifyMessage(learner.getId(), teacher.getId(), null,
                    "Escrow auto‑released 48h after the session time.");
            count++;
        }
        return count;
    }
}
