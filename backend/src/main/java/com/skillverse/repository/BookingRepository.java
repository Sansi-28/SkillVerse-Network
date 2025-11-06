package com.skillverse.repository;

import com.skillverse.model.enums.BookingStatus;
import com.skillverse.model.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // For the auto-release scheduled job
    List<Booking> findAllByStatusAndBookingTimeBefore(BookingStatus status, LocalDateTime threshold);


    

    List<Booking> findByListing_Teacher_Email(String teacherEmail);

    List<Booking> findByLearnerEmail(String learnerEmail);
}