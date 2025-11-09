package com.skillverse.repository;

import com.skillverse.model.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversationKeyOrderByCreatedAtAsc(String conversationKey);

    long countByRecipient_IdAndReadAtIsNull(Long userId);

    @Query(value = """
      SELECT m.*
      FROM messages m
      JOIN (
        SELECT conversation_key, MAX(id) AS last_id
        FROM messages
        WHERE sender_id = :userId OR recipient_id = :userId
        GROUP BY conversation_key
      ) x ON m.id = x.last_id
      ORDER BY m.created_at DESC
    """, nativeQuery = true)
    List<Message> findLastMessagesPerConversation(@Param("userId") Long userId);
}
