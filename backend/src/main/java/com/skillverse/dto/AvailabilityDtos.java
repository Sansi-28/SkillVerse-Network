// backend/src/main/java/com/skillverse/dto/AvailabilityDtos.java
package com.skillverse.dto;

import java.time.LocalDateTime;

public class AvailabilityDtos {
    public record CreateSlotRequest(LocalDateTime startTime, LocalDateTime endTime, String timeZone) {}
    public record SlotResponse(Long id, Long teacherId, LocalDateTime startTime, LocalDateTime endTime, String timeZone, boolean reserved) {}
}
