// backend/src/main/java/com/skillverse/repository/AvailabilitySlotRepository.java
package com.skillverse.repository;

import com.skillverse.model.entity.AvailabilitySlot;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {
    List<AvailabilitySlot> findByTeacher_IdAndReservedFalseAndEndTimeAfterOrderByStartTimeAsc(Long teacherId, LocalDateTime now);
    List<AvailabilitySlot> findByTeacher_IdOrderByStartTimeAsc(Long teacherId);
    boolean existsByTeacher_IdAndReservedFalseAndStartTimeLessThanAndEndTimeGreaterThan(Long teacherId, LocalDateTime end, LocalDateTime start);
}
