package com.example.backend.services;

import com.example.backend.entities.Likes;
import com.example.backend.entities.Notification;
import com.example.backend.entities.User;
import com.example.backend.repositories.*;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LikesService {
    @Autowired
    private LikesRepository likesRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private WebSocketNotificationService webSocketNotificationService;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private BlogRepository blogRepository;

    public Likes addLike(Likes like) {
        return likesRepository.save(like);
    }


    public Likes addLikeWithChecking(Integer userId, String type, Integer referenceId) {
        Likes like = likesRepository.findByUserIdAndTypeAndReferenceId(userId, type, referenceId);
        if (like == null) {
            like = new Likes();
            like.setAppUser(userRepository.findById(userId.longValue()).get());
            like.setType(type);
            like.setReferenceID(referenceId);
            like.setTimestamp(LocalDateTime.now());

            System.out.println("Hi I am like" + like);
//            Notification notification = createNotificationForLike(userId, like, referenceId);
//            System.out.println("Hi I am notification" + notification);
            System.out.println("Hi I am type" + type);
            if(type.equals("event")) {
                if(!checkingIsMyContent(userId, referenceId, type)) {
                    String userIdNoti = eventRepository.findById(referenceId.longValue()).get().getUserId().toString();
                    Notification notification = createNotificationForLike(Integer.parseInt(userIdNoti), like, referenceId, userId, "LIKE EVENT");
                    webSocketNotificationService.notifyUser(userIdNoti, notification);
                }
//                String userIdNoti = eventRepository.findById(referenceId.longValue()).get().getUserId().toString();
//                Notification notification = createNotificationForLike(Integer.parseInt(userIdNoti), like, referenceId, userId, "LIKE EVENT");
//                webSocketNotificationService.notifyUser(userIdNoti, notification);
            } else if (type.equals("blog")) {
                if(!checkingIsMyContent(userId, referenceId, type)) {
                    System.out.println("Blog testing for notification");
                    String userIdNoti = blogRepository.findBlogById(referenceId).getAppUser().getId().toString();
                    Notification notification = createNotificationForLike(Integer.parseInt(userIdNoti), like, referenceId, userId, "LIKE BLOG");
                    webSocketNotificationService.notifyUser(userIdNoti, notification);
                }
            }

            return likesRepository.save(like);
        }else {
            likesRepository.deleteById(like.getLikeID());
            System.out.println("Deleted");
        }
        return like;
    }

    public boolean checkingIsMyContent(Integer userId, Integer referenceId, String type) {
        if (type.equals("event")) {
            return eventRepository.findById(Long.parseLong(String.valueOf(referenceId))).get().getUserId().equals(Long.parseLong(String.valueOf(userId)));
        } else if (type.equals("blog")) {
            return blogRepository.findBlogById(referenceId
            ).getAppUser().getId().equals(Long.parseLong(String.valueOf(userId)));
        }
        return false;
    }

    private Notification createNotificationForLike(Integer id, Likes like, Integer referenceId, Integer fromId, String type) {
        Notification notification = new Notification();
        notification.setAppUser(userRepository.findById(id.longValue()).orElseThrow(() -> new RuntimeException("User not found")));        notification.setContent("Your post got a new like!");
        notification.setType(type);
        notification.setIsRead("N");
        notification.setTimestamp(LocalDateTime.now());
        notification.setReferenceID(referenceId);
        notification.setFromId(userRepository.findById(fromId.longValue()).orElseThrow(() -> new RuntimeException("User not found")));
        notificationRepository.save(notification);
        return notification;
    }

    public boolean likeByMe(Integer userId, String type, Integer referenceId) {
        Likes like = likesRepository.findByUserIdAndTypeAndReferenceId(userId, type, referenceId);
        return like != null;
    }

    public Likes getAllLikes(Integer referenceId, String type) {
        return likesRepository.findByReferenceIdAndType(referenceId, type);
    }

    public String countLike(Integer referenceId, String type) {
        return String.valueOf(likesRepository.calculateLikes(referenceId, type));
    }

    public void removeLike(Integer likeId) {
        likesRepository.deleteById(likeId);
    }
}

