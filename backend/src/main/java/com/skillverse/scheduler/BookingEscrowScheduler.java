// backend/src/main/java/com/skillverse/scheduler/BookingEscrowScheduler.java
package com.skillverse.scheduler;

import com.skillverse.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class BookingEscrowScheduler {

    private static final Logger log = LoggerFactory.getLogger(BookingEscrowScheduler.class);
    private final BookingService bookingService;

    public BookingEscrowScheduler(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Runs every hour at the top of the hour
    @Scheduled(cron = "0 0 * * * *")
    public void runAutoRelease() {
        log.info("Running scheduled job: Auto-Release Escrow...");
        try {
            bookingService.autoReleaseEscrow();
            log.info("Auto-Release Escrow job finished successfully.");
        } catch (Exception e) {
            log.error("Error during scheduled escrow auto-release", e);
        }
    }
}