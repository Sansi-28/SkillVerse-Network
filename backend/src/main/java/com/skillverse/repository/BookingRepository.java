// backend/src/main/java/com/skillverse/repository/BookingRepository.java
package com.skillverse.repository;

import com.skillverse.model.enums.BookingStatus;
import com.skillverse.model.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findAllByStatusAndBookingTimeBefore(BookingStatus status, LocalDateTime threshold);

    List<Booking> findByListing_Teacher_Email(String teacherEmail);

    // FIX: align with Booking.learner (User) -> User.email
    List<Booking> findByLearner_Email(String learnerEmail);

    List<Booking> findByLearnerEmail(String learnerEmail);
}
