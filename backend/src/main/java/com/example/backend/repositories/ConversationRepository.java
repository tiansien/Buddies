package com.example.backend.repositories;

import com.example.backend.entities.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface ConversationRepository extends JpaRepository<Conversation, Integer> {

    @Query("SELECT c FROM Conversation c JOIN c.groupMembers gm WHERE gm.appUser.id IN :userIds AND c.conversationID = :conversationId")
    List<Conversation> findConversationsByUsers(@Param("userIds") Set<Long> userIds, @Param("conversationId") long conversationId);

    @Query("SELECT c FROM Conversation c JOIN c.groupMembers gm WHERE gm.appUser.id IN :userIds GROUP BY c.conversationID, c.conversationName, c.isGroup HAVING COUNT(c.conversationID) = :size")
    Conversation findConversationIdByGroupMembersAndSize(@Param("userIds") Set<Long> userIds, @Param("size") long size);

}
