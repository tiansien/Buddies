package com.example.backend.services;

import com.example.backend.dtos.NotificationDto;
import com.example.backend.entities.Blog;
import com.example.backend.entities.Message;
import com.example.backend.entities.Notification;
import com.example.backend.entities.User;
import com.example.backend.repositories.NotificationRepository;
import com.example.backend.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Notification> getAllNotifications(Integer userId) {
        return notificationRepository.findAllByUserId(userId);
    }

    public Notification addNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public Notification markAsRead(Integer notificationId, String isRead) {
        return notificationRepository.findById(notificationId).map(notification -> {
            notification.setIsRead(isRead);
            return notificationRepository.save(notification);
        }).orElse(null);
    }

    public void createNotification(String userId, String type, Integer referenceId, String content) {
        Notification notification = new Notification();
        notification.setAppUser(userRepository.findById(Long.parseLong(userId)).orElseThrow());
        notification.setType(type);
        notification.setReferenceID(referenceId);
        notification.setContent(content);
        notification.setIsRead("N");
        notification.setTimestamp(LocalDateTime.now());

        notification = notificationRepository.save(notification);

    }

    public void handleBlogActivity(String type, Blog blog, User actor) {
        String content = switch (type) {
            case "COMMENT" -> actor.getLogin() + " commented on your post";
            case "LIKE" -> actor.getLogin() + " liked your post";
            default -> throw new IllegalArgumentException("Invalid type: " + type);
        };

        createNotification(
                blog.getAppUser().getId().toString(),
                type,
                blog.getBlogID(),
                content
        );
    }

    public void handleMessageNotification(Message message, String recipientId) {
        createNotification(
                recipientId,
                "MESSAGE",
                message.getConversationID(),
                "New message from " + message.getFromUserId()
        );
    }

    public NotificationDto convertToDTO(Notification notification) {
        NotificationDto notificationDTO = new NotificationDto();
        notificationDTO.setNotificationID(notification.getNotificationID());
        notificationDTO.setAppUserID(notification.getAppUser().getId().intValue());
        notificationDTO.setType(notification.getType());
        notificationDTO.setReferenceID(notification.getReferenceID());
        notificationDTO.setContent(notification.getContent());
        notificationDTO.setTimestamp(notification.getTimestamp());
        notificationDTO.setIsRead(notification.getIsRead());
        return notificationDTO;
    }
}
