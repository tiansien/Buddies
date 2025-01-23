package com.example.backend.controllers;

import com.example.backend.dtos.MessageDto;
import com.example.backend.entities.Conversation;
import com.example.backend.entities.GroupMember;
import com.example.backend.entities.Message;
import com.example.backend.entities.User;
import com.example.backend.repositories.ConversationRepository;
import com.example.backend.repositories.GroupMemberRepository;
import com.example.backend.repositories.MessageRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.services.MessagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/messaging")
public class MessagingController {

    @Autowired
    private MessagingService messagingService;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/groupMembers")
    public List<?> getAllGroupMembers() {
        return messagingService.getAllGroupMembers();
    }

    @GetMapping("/conversations/{id}")
    public Object getConversationById(@PathVariable Integer id) {
        return messagingService.getConversationById(id);
    }

    @PostMapping("/sendMessage")
    public Object sendMessage(@RequestBody Message message) {
        return messagingService.sendMessage(message);
    }


    public Conversation createConversation(Set<Long> userIds, String conversationName, boolean isGroup) {
        Conversation conversation = new Conversation();
        conversation.setConversationName(conversationName);
        conversation.setIsGroup(isGroup ? "Y" : "N");
        conversation = conversationRepository.save(conversation);

        for (Long userId : userIds) {
            GroupMember member = new GroupMember();
            member.setConversation(conversation);

            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            member.setAppUser(user);
            member.setRole("member"); // Default role, modify as needed
            groupMemberRepository.save(member);
        }
        return conversation;
    }

    @PostMapping("/send")
    public ResponseEntity<Message> sendFirstMessage(@RequestBody MessageDto messageDTO) {
        Message message = messagingService.sendMessage(
                messageDTO.getFromUserId().longValue(),
                new HashSet<>(messageDTO.getUserIds()),
                messageDTO.getContent(),
                messageDTO.getConversationName(),
                messageDTO.getIsGroup());
        return ResponseEntity.ok(message);
    }

    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getMessagesForUsers(@RequestBody List<Long> userIds) {
        Set<Long> userIdSet = new HashSet<>(userIds); // Ensure no duplicates
        List<Message> messages = messagingService.getMessagesForUsers(userIdSet);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/lastMessagesWithFollowContacts/{userId}")
    public ResponseEntity<List<?>> getLastMessageWithUserWithAllFollowContacts(@PathVariable Long userId) {
        List<?> lastMessages = messagingService.getLastMessageWithUserWithAllFollowContacts2(userId);
        return ResponseEntity.ok(lastMessages);
    }

    @GetMapping("/allMessagesByConversationId/{conversationId}")
    public ResponseEntity<List<Message>> getAllMessageByConversationId(@PathVariable Long conversationId) {
        List<Message> messages = messagingService.getAllMessageByConversationId(conversationId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/setMessageRead/{messageId}")
    public ResponseEntity<Message> setMessageRead(@PathVariable Integer messageId) {
        Message message = messagingService.setMessageRead(messageId);
        return ResponseEntity.ok(message);
    }

}
