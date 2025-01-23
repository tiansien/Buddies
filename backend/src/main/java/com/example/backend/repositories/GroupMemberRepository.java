package com.example.backend.repositories;

import com.example.backend.entities.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Integer> {

//    @Query("SELECT gm.conversation.conversationID FROM GroupMember gm WHERE gm.appUser.id IN (:userId, :anotherUserId) GROUP BY gm.conversation.conversationID HAVING COUNT(gm.conversation.conversationID) = :size")
//    Long findConversationIdByGroupMembersAndSize(List<Long> userIds, int size);

    @Query("SELECT gm.conversation.conversationID FROM GroupMember gm WHERE gm.appUser.id IN (:userIds) GROUP BY gm.conversation.conversationID HAVING COUNT(gm.conversation.conversationID) = :size")
    Long findConversationIdByGroupMembersAndSize(List<Long> userIds, int size);
}
