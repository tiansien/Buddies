package com.example.backend.repositories;

import com.example.backend.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    @Query("SELECT n FROM Notification n WHERE n.appUser.id = :userId")
    List<Notification> findAllByUserId(Integer userId);
}
