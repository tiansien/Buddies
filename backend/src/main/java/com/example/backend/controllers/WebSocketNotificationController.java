package com.example.backend.controllers;

import com.example.backend.entities.Notification;
import com.example.backend.entities.User;
import com.example.backend.repositories.UserRepository;
import com.example.backend.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@Controller
public class WebSocketNotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @MessageMapping("/notify")
    @SendToUser("/queue/notifications")
    public Notification send(Notification notification, @Header("simpSessionAttributes") Map<String, Object> sessionAttributes) {

        Logger logger = LoggerFactory.getLogger(WebSocketNotificationController.class);

        // Log the contents of the sessionAttributes map
        logger.info("simpSessionAttributes contents: " + sessionAttributes);

        String userId = (String) sessionAttributes.get("userId");
        userRepository.findById(Long.parseLong(userId)).ifPresent(notification::setAppUser);  // Proper use of Optional
        return notificationService.addNotification(notification);  // Process and save the notification
    }

}
