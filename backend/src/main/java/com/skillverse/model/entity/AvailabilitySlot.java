package com.skillverse.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "availability_slots", indexes = {
        @Index(name = "idx_avail_teacher_time", columnList = "teacher_id,start_time,end_time")
})
public class AvailabilitySlot {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private User teacher;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "time_zone", nullable = false, length = 64)
    private String timeZone;

    @Column(nullable = false)
    private boolean reserved = false;

    public Long getId() { return id; }
    public User getTeacher() { return teacher; }
    public void setTeacher(User teacher) { this.teacher = teacher; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public String getTimeZone() { return timeZone; }
    public void setTimeZone(String timeZone) { this.timeZone = timeZone; }
    public boolean isReserved() { return reserved; }
    public void setReserved(boolean reserved) { this.reserved = reserved; }
}
