package com.example.backend.controllers;

import com.example.backend.entities.Notification;
import com.example.backend.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // This method handles new notifications from clients and sends them to specific users
    @PostMapping
    public Notification addNotification(@RequestBody Notification notification) {
        // Save the notification
        Notification savedNotification = notificationService.addNotification(notification);

        return savedNotification;
    }

    // Get all notifications for a specific user
    @GetMapping("/{userId}")
    public List<Notification> getUserNotifications(@PathVariable Integer userId) {
        return notificationService.getAllNotifications(userId);
    }

    // Mark a notification as read
    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Integer id) {
        notificationService.markAsRead(id, "Y");
    }
}
