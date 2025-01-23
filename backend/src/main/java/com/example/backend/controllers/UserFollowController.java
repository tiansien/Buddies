package com.example.backend.controllers;

import com.example.backend.entities.UserFollow;
import com.example.backend.services.MessagingService;
import com.example.backend.services.UserFollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/userfollow")
public class UserFollowController {

    @Autowired
    private UserFollowService userFollowService;

    @PostMapping("/followUser")
    public UserFollow followUser(@RequestBody UserFollow userFollow) {
        return userFollowService.followUser(userFollow);
    }

    @DeleteMapping("/unfollowUser/{followID}")
    public void unfollowUser(@PathVariable Integer followID) {
        userFollowService.unfollowUser(followID);
    }

    @PostMapping("/checkingFollow")
    public void checkingFollow(@RequestParam Long followerID, @RequestParam Long followingID) {
        userFollowService.checkingFollow(followerID, followingID);
    }

    @GetMapping("/isFollowing")
    public Boolean isFollowing(@RequestParam Long followerID, @RequestParam Long followingID) {
        return userFollowService.isFollowing(followerID, followingID);
    }

    @GetMapping("/getAllFollows/{followerID}")
    public List<UserFollow> getAllFollows(@PathVariable Long followerID) {
        return userFollowService.getAllFollows(followerID);
    }

    @GetMapping("/getAllFollowings/{followingID}")
    public List<UserFollow> getAllFollowings(@PathVariable Long followedID) {
        return userFollowService.getAllFollowings(followedID);
    }

    @GetMapping("/countFollowing/{followerID}")
    public Long countFollowing(@PathVariable Long id) {
        return userFollowService.countFollowing(id);
    }

    @GetMapping("/countFollower/{followingID}")
    public Long countFollower(@PathVariable Long followedID) {
        return userFollowService.countFollower(followedID);
    }

    @GetMapping("/getFollowingAndFollower/{id}")
    public Map<String, ?> getFollowingAndFollower(@PathVariable Long id) {
        return userFollowService.getAllInformationById(id);
    }


}
