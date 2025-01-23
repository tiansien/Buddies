package com.example.backend.controllers;

import com.example.backend.entities.Likes;
import com.example.backend.entities.Notification;
import com.example.backend.repositories.NotificationRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.services.LikesService;
import com.example.backend.services.WebSocketNotificationService;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/likes")
public class LikesController {

    @Autowired
    private LikesService likesService;

    @PostMapping
    public Likes addLike(@RequestBody Likes like) {
        return likesService.addLike(like);
    }

    @PostMapping("/{referenceId}/{type}")
    public Likes getAllLikes(
            @PathVariable Integer referenceId,
            @PathVariable String type
    ) {
        return likesService.getAllLikes(referenceId, type);
    }

//    Will checking if the user has liked the post or not, like no like then will like if like will remove the like
    @PostMapping("/{userId}/{type}/{referenceId}")
    public Likes addLike(
            @PathVariable Integer userId,
            @PathVariable String type,
            @PathVariable Integer referenceId
    ) {
        Likes like = likesService.addLikeWithChecking(userId, type, referenceId);
        return like;
    }

    @GetMapping("likeByMe/{userId}/{type}/{referenceId}")
    public boolean likeByMe(
            @PathVariable Integer userId,
            @PathVariable String type,
            @PathVariable Integer referenceId
    ) {
        return likesService.likeByMe(userId, type, referenceId);
    }

    @GetMapping("countlike/{referenceId}/{type}")
    public String countLike(
            @PathVariable Integer referenceId,
            @PathVariable String type
    ) {
        return likesService.countLike(referenceId, type);
    }

    @GetMapping("getcolandlikebyme/{userId}/{type}/{referenceId}")
    public Map<String, String> getColAndLikeByMe(
            @PathVariable Integer userId,
            @PathVariable String type,
            @PathVariable Integer referenceId
    ) {
        return Map.of(
                "count", likesService.countLike(referenceId, type),
                "likeByMe", String.valueOf(likesService.likeByMe(userId, type, referenceId))
        );
    }


    @DeleteMapping("/{likeId}")
    public void removeLike(@PathVariable Integer likeId) {
        likesService.removeLike(likeId);
    }
}
