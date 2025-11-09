// backend/src/main/java/com/skillverse/service/AvailabilityService.java
package com.skillverse.service;

import com.skillverse.dto.AvailabilityDtos.*;
import com.skillverse.model.entity.AvailabilitySlot;
import com.skillverse.model.entity.User;
import com.skillverse.repository.AvailabilitySlotRepository;
import com.skillverse.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class AvailabilityService {
    private final AvailabilitySlotRepository repo;
    private final UserRepository users;

    public AvailabilityService(AvailabilitySlotRepository repo, UserRepository users) {
        this.repo = repo; this.users = users;
    }

    public List<SlotResponse> listOpenByTeacher(Long teacherId) {
        LocalDateTime now = LocalDateTime.now();
        return repo.findByTeacher_IdAndReservedFalseAndEndTimeAfterOrderByStartTimeAsc(teacherId, now)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<SlotResponse> listAllByTeacher(Long teacherId) {
        return repo.findByTeacher_IdOrderByStartTimeAsc(teacherId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public SlotResponse create(Long teacherId, CreateSlotRequest req) {
        if (req.startTime() == null || req.endTime() == null || !req.endTime().isAfter(req.startTime())) {
            throw new IllegalArgumentException("Invalid time range");
        }
        if (repo.existsByTeacher_IdAndReservedFalseAndStartTimeLessThanAndEndTimeGreaterThan(
                teacherId, req.endTime(), req.startTime())) {
            throw new IllegalArgumentException("Overlapping slot exists");
        }
        User teacher = users.findById(teacherId).orElseThrow();
        AvailabilitySlot slot = new AvailabilitySlot();
        slot.setTeacher(teacher);
        slot.setStartTime(req.startTime());
        slot.setEndTime(req.endTime());
        slot.setTimeZone(req.timeZone() != null ? req.timeZone() : "UTC");
        return toDto(repo.save(slot));
    }

    @Transactional
    public void deleteOwned(Long teacherId, Long slotId) {
        AvailabilitySlot slot = repo.findById(slotId).orElseThrow();
        if (!slot.getTeacher().getId().equals(teacherId)) throw new SecurityException("Not your slot");
        if (slot.isReserved()) throw new IllegalStateException("Cannot delete reserved slot");
        repo.delete(slot);
    }

    public AvailabilitySlot requireOpenSlot(Long slotId) {
        AvailabilitySlot slot = repo.findById(slotId).orElseThrow();
        if (slot.isReserved()) throw new IllegalStateException("Slot already reserved");
        if (slot.getEndTime().isBefore(LocalDateTime.now())) throw new IllegalStateException("Slot is in the past");
        return slot;
    }

    public AvailabilitySlot markReserved(AvailabilitySlot slot) {
        slot.setReserved(true);
        return repo.save(slot);
    }

    private SlotResponse toDto(AvailabilitySlot s) {
        return new SlotResponse(s.getId(), s.getTeacher().getId(), s.getStartTime(), s.getEndTime(), s.getTimeZone(), s.isReserved());
    }
}
