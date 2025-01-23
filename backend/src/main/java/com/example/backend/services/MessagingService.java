package com.example.backend.services;

import ch.qos.logback.core.joran.util.beans.BeanUtil;
import com.example.backend.entities.*;
import com.example.backend.repositories.*;
import org.springframework.beans.BeanInfoFactory;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class MessagingService {

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserFollowRepository userFollowRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private WebSocketNotificationService webSocketNotificationService;

    public List<GroupMember> getAllGroupMembers() {
        return groupMemberRepository.findAll();
    }

    public Conversation getConversationById(Integer id) {
        return conversationRepository.findById(id).orElse(null);
    }

    public Message sendMessage(Message message) {
        return messageRepository.save(message);
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

    public Message sendMessage(Long fromUserId, Set<Long> userIds, String content, String conversationName, boolean isGroup) {
        // Check if a conversation already exists or not
        Conversation existingConversations = conversationRepository.findConversationIdByGroupMembersAndSize(userIds, userIds.size());
        Conversation conversation;

        if (existingConversations == null) {
            conversation = createConversation(userIds, conversationName, isGroup);
        } else {
            conversation = existingConversations;  // Assuming the first match is correct, or handle selection logic
        }

        Message message = new Message();
        message.setConversationID(conversation.getConversationID());
        message.setFromUserId(fromUserId.toString());
        message.setContent(content);
        message.setSentDateTime(LocalDateTime.now());

        Long userIdsTemp = userIds.remove(fromUserId) ? userIds.iterator().next(): fromUserId;

        String userIdNoti = userIdsTemp.toString();
        Notification notification = createNotificationForMessage(Integer.parseInt(userIdNoti),message , 111, Integer.parseInt(message.getFromUserId()) , "MESSAGE");
        webSocketNotificationService.notifyUser(userIdNoti, notification);

        return messageRepository.save(message);
    }

    private Notification createNotificationForMessage(Integer id,Message message, Integer referenceId, Integer fromId, String type) {
        Notification notification = new Notification();
        notification.setAppUser(userRepository.findById(id.longValue()).orElseThrow(() -> new RuntimeException("User not found")));
        notification.setContent("Your blog got a new like!");
        notification.setType(type);
        notification.setIsRead("N");
        notification.setTimestamp(LocalDateTime.now());
        notification.setReferenceID(referenceId);
        notification.setContent(message.getContent());
        notification.setFromId(userRepository.findById(fromId.longValue()).orElseThrow(() -> new RuntimeException("User not found")));
        notificationRepository.save(notification);
        return notification;
    }

    public List<Message> getMessagesForUsers(Set<Long> userIds) {
        List<Conversation> conversations = conversationRepository.findConversationsByUsers(userIds, userIds.size());
        List<Message> messages = new ArrayList<>();
        for (Conversation conversation : conversations) {
//            messages.addAll(messageRepository.findByConversation_ConversationIDOrderBySentDateTimeAsc(conversation.getConversationID().longValue()));
        }
        return messages;
    }

    public List<?> getAllFollowContacts(Long userId) {
        return userFollowRepository.getAllFollowContactsById(userId);
    }

//    public Map<String, Object> getLastMessageWithUser(Long conversationID, Long userId) {
//        Map<String, Object> lastMessageWithUser = new HashMap<>();
//        Optional<User> user = userRepository.findById(userId);
//        lastMessageWithUser.put("user", user.orElse(null));
//        lastMessageWithUser.put("lastmessage", messageRepository.findLastMessageWithUser(conversationID));
//        return lastMessageWithUser;
//    }

//    @Transactional
//    public List<?> getLastMessageWithUserWithAllFollowContacts(Long userId) {
//        List<Object> lastMessageWithUserWithAllFollowContacts = new ArrayList<>();
//        List<UserFollow> followContacts = userFollowRepository.getAllFollowContactsById(userId);
//        followContacts.forEach(followContact -> {
//            Map<String, Object> lastMessageWithUser = new HashMap<>();
//            lastMessageWithUser.put("user", userRepository.findById(followContact.getId()).orElse(null));
//            lastMessageWithUser.put("lastmessage", messageRepository.findLastMessageWithUser(followContact.getId()));
//            lastMessageWithUserWithAllFollowContacts.add(lastMessageWithUser);
//        });
//        return lastMessageWithUserWithAllFollowContacts;
//    }

    @Transactional
    public List<?> getLastMessageWithUserWithAllFollowContacts(Long userId) {
        List<Map<String, Object>> lastMessageWithUserWithAllFollowContacts = new ArrayList<>();
        List<UserFollow> followContacts = userFollowRepository.getAllFollowContactsById(userId);
        followContacts.forEach(followContact -> {
            Map<String, Object> lastMessageWithUser = new HashMap<>();
            lastMessageWithUser.put("user", userRepository.findById(followContact.getFollowedId()).orElse(null));
//            find CoversationId with group members from ids
//            do a arraw of group members id with userId and FollowContact.getId
            List<Long> groupMemberIds = Arrays.asList(userId, followContact.getFollowedId());
//            Using groupMemberIds and groupMemberIds.size() to find conversationId
            Long conversationId = groupMemberRepository.findConversationIdByGroupMembersAndSize(groupMemberIds, groupMemberIds.size());
            System.out.println("groupMembers: " + conversationId);

            List<Message> messages = messageRepository.findLastMessageWithConversationIdDesc(conversationId);
            System.out.println("messages: " + messages);

            lastMessageWithUser.put("lastmessage", messages.isEmpty() ? null : messages.get(0));
            lastMessageWithUser.put("profile", profileRepository.findById(followContact.getId().intValue()).orElse(null));
            lastMessageWithUserWithAllFollowContacts.add(lastMessageWithUser);
        });
        lastMessageWithUserWithAllFollowContacts.sort((a, b) -> {
            LocalDateTime dateTimeA = Optional.ofNullable((Message) a.get("lastmessage"))
                    .map(Message::getSentDateTime)
                    .orElse(LocalDateTime.MIN);
            LocalDateTime dateTimeB = Optional.ofNullable((Message) b.get("lastmessage"))
                    .map(Message::getSentDateTime)
                    .orElse(LocalDateTime.MIN);
            return dateTimeB.compareTo(dateTimeA); // Sort in descending order
        });
        return lastMessageWithUserWithAllFollowContacts;
    }

    @Transactional
    public List<?> getLastMessageWithUserWithAllFollowContacts2(Long userId) {
        List<Map<String, Object>> lastMessageWithUserWithAllFollowContacts = new ArrayList<>();
        List<UserFollow> followContacts = userFollowRepository.getAllFollowContactsById(userId);
        List<User> allUsers = userRepository.findAllExceptMe(userId);
        allUsers.forEach(allUser -> {
            Map<String, Object> lastMessageWithUser = new HashMap<>();
            lastMessageWithUser.put("user", userRepository.findById(allUser.getId()).orElse(null));
//            find CoversationId with group members from ids
//            do a arraw of group members id with userId and FollowContact.getId
            List<Long> groupMemberIds = Arrays.asList(userId, allUser.getId());
//            Using groupMemberIds and groupMemberIds.size() to find conversationId
            Long conversationId = groupMemberRepository.findConversationIdByGroupMembersAndSize(groupMemberIds, groupMemberIds.size());
            System.out.println("groupMembers: " + conversationId);

            List<Message> messages = messageRepository.findLastMessageWithConversationIdDesc(conversationId);
            System.out.println("messages: " + messages);

            lastMessageWithUser.put("lastmessage", messages.isEmpty() ? null : messages.get(0));
            lastMessageWithUser.put("profile", profileRepository.findById(allUser.getId().intValue()).orElse(null));
            lastMessageWithUserWithAllFollowContacts.add(lastMessageWithUser);
        });
        lastMessageWithUserWithAllFollowContacts.sort((a, b) -> {
            LocalDateTime dateTimeA = Optional.ofNullable((Message) a.get("lastmessage"))
                    .map(Message::getSentDateTime)
                    .orElse(LocalDateTime.MIN);
            LocalDateTime dateTimeB = Optional.ofNullable((Message) b.get("lastmessage"))
                    .map(Message::getSentDateTime)
                    .orElse(LocalDateTime.MIN);
            return dateTimeB.compareTo(dateTimeA); // Sort in descending order
        });
        return lastMessageWithUserWithAllFollowContacts;
    }


    public List<Message> getAllMessageByConversationId(Long conversationId) {
        return messageRepository.findLastMessageWithConversationIdAsc(conversationId);
    }

    public Message setMessageRead(Integer messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow(() -> new RuntimeException("Message not found"));
        message.setReadStatus("Y");
        return messageRepository.save(message);
    }
}
