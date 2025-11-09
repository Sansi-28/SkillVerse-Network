// backend/src/main/java/com/skillverse/scheduler/BookingEscrowScheduler.java
package com.skillverse.scheduler;

import com.skillverse.service.EscrowService;
import java.time.Duration;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class BookingEscrowScheduler {

    private final EscrowService escrow;

    public BookingEscrowScheduler(EscrowService escrow) {
        this.escrow = escrow;
    }

    // every 15 minutes
    @Scheduled(cron = "0 */15 * * * *")
    public void runAutoRelease() {
        escrow.autoRelease(Duration.ofHours(48));
    }
}
