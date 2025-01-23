package com.example.backend.services;

import com.example.backend.entities.Comment;
import com.example.backend.entities.Likes;
import com.example.backend.entities.Notification;
import com.example.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ProfileService profileService;

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

    public List<Comment> getAllComments(Integer referenceId, String type) {
        return commentRepository.findAllByReferenceIdAndType(referenceId, type);
    }

    public Comment addComment(Comment comment) {
        comment.setTimestamp(java.time.LocalDateTime.now());
        boolean isMyContent = checkingIsMyContent(comment.getId().intValue(), Integer.parseInt(comment.getReferenceID()), comment.getType());

        if(comment.getType().equals("event")) {
            if(!isMyContent) {
                Long referenceId = Long.parseLong(comment.getReferenceID());
                String userIdNoti = eventRepository.findById(referenceId).get().getUserId().toString();
                Notification notification = createNotificationForLike(Integer.parseInt(userIdNoti),comment , Integer.parseInt(comment.getReferenceID()), comment.getId().intValue(), "COMMENT EVENT");
                webSocketNotificationService.notifyUser(userIdNoti, notification);
            }
//            Long referenceId = Long.parseLong(comment.getReferenceID());
//            String userIdNoti = eventRepository.findById(referenceId).get().getUserId().toString();
//            Notification notification = createNotificationForLike(Integer.parseInt(userIdNoti),comment , Integer.parseInt(comment.getReferenceID()), comment.getId().intValue(), "COMMENT EVENT");
//            webSocketNotificationService.notifyUser(userIdNoti, notification);
        } else if (comment.getType().equals("blog")) {
            if (!isMyContent) {
                System.out.println("Blog testing for notification");
                Long referenceId = Long.parseLong(comment.getReferenceID());
                String userIdNoti = blogRepository.findBlogById(referenceId.intValue()).getAppUser().getId().toString();
                Notification notification = createNotificationForLike(Integer.parseInt(userIdNoti), comment, Integer.parseInt(comment.getReferenceID()), comment.getId().intValue(), "COMMENT BLOG");
                webSocketNotificationService.notifyUser(userIdNoti, notification);
            }
//            System.out.println("Blog testing for notification");
//            Long referenceId = Long.parseLong(comment.getReferenceID());
//            String userIdNoti = blogRepository.findBlogById(referenceId.intValue()).getAppUser().getId().toString();
//            Notification notification = createNotificationForLike(Integer.parseInt(userIdNoti),comment, Integer.parseInt(comment.getReferenceID()), comment.getId().intValue(), "COMMENT BLOG");
//            webSocketNotificationService.notifyUser(userIdNoti, notification);
        }
        return commentRepository.save(comment);
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


    public Map<String, List<?>> getCommentWithProfile(Integer referenceId, String type) {
        Map<String, List<?>> commentWithProfile = new HashMap<>();
        List<Comment> comments = commentRepository.findAllByReferenceIdAndType(referenceId, type);
        System.out.println("Thia is comment "+comments.toString());
        Set<Integer> processedIds = new HashSet<>();
        List<Object> UserProfile = new ArrayList<>();
        for (Comment comment : comments) {
            commentWithProfile.put("comment", comments);
            if (!processedIds.contains(comment.getId().intValue())) {
                System.out.println("This is comment id "+comment.getId().intValue());
                commentWithProfile.put("userProfile", profileService.getUserAndProfileById2(comment.getId().intValue()));
                UserProfile.add(profileService.getUserAndProfileById2(comment.getId().intValue()));
                processedIds.add(comment.getId().intValue());
            }
        }
        commentWithProfile.put("userProfile", UserProfile);
        return commentWithProfile;
    }

    private Notification createNotificationForLike(Integer id, Comment comment, Integer referenceId, Integer fromId, String type) {
        Notification notification = new Notification();
        notification.setAppUser(userRepository.findById(id.longValue()).orElseThrow(() -> new RuntimeException("User not found")));        notification.setContent("Your post got a new like!");
        notification.setType(type);
        notification.setIsRead("N");
        notification.setTimestamp(LocalDateTime.now());
        notification.setReferenceID(referenceId);
        notification.setContent(comment.getContent());
        notification.setFromId(userRepository.findById(fromId.longValue()).orElseThrow(() -> new RuntimeException("User not found")));
        notificationRepository.save(notification);
        return notification;
    }

    public void makeNewComment(Comment comment) {
        commentRepository.save(comment);
    }

    public String getTotalCommentCount(Integer referenceId, String type) {
        List<Comment> comments = commentRepository.findAllByReferenceIdAndType(referenceId, type);
        return String.valueOf(comments.size());
    }

}
