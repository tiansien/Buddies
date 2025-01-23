package com.example.backend.repositories;

import com.example.backend.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

//    List<Message> findByConversation_ConversationIDOrderBySentDateTimeAsc(Long conversationID);

    @Query("SELECT m FROM Message m WHERE m.ConversationID = :conversationID ORDER BY m.sentDateTime DESC")
    List<Message> findLastMessageWithUser(Long conversationID);

    @Query("SELECT m FROM Message m WHERE m.ConversationID = :conversationID ORDER BY m.sentDateTime DESC")
    List<Message> findLastMessageWithConversationIdDesc(Long conversationID);

    @Query("SELECT m FROM Message m WHERE m.ConversationID = :conversationID ORDER BY m.sentDateTime ASC")
    List<Message> findLastMessageWithConversationIdAsc(Long conversationID);
}
