package com.skillverse.repository;

import com.skillverse.model.entity.Notification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser_IdOrderByCreatedAtDesc(Long userId);
    long countByUser_IdAndReadAtIsNull(Long userId);
}
