package com.example.backend.services;


import com.example.backend.entities.UserFollow;
import com.example.backend.repositories.BuddyRequestRepository;
import com.example.backend.repositories.UserFollowRepository;
import com.example.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserFollowService {

    @Autowired
    private UserFollowRepository userFollowRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BuddyRequestRepository buddyRequestRepository;

    public UserFollow followUser(UserFollow userFollow) {
        return userFollowRepository.save(userFollow);
    }

    public void unfollowUser(Integer followID) {
        userFollowRepository.deleteById(followID);
    }

    @Transactional
    public UserFollow checkingFollow(Long id, Long followedID) {
        UserFollow userFollow = userFollowRepository.findByFollowerIDAndFollowingID(id, followedID);
        if (userFollow == null) {
            userFollow = new UserFollow();
//            userFollow.setAppUser(userRepository.findById(id).get());
//            userFollow.setFollowedUser(userRepository.findById(followedID).get());
            userFollow.setId(id);
            userFollow.setFollowedId(followedID);
            userFollowRepository.save(userFollow);
            return userFollow;
        } else {
            userFollowRepository.deleteFollowWithIdFollowedId(id, followedID);
            return userFollowRepository.findByFollowerIDAndFollowingID(id, followedID);
        }
    }

    @Transactional
    public Boolean isFollowing(Long id, Long followedID) {
        UserFollow userFollow = userFollowRepository.findByFollowerIDAndFollowingID(id, followedID);
        System.out.println(userFollow != null);
        return userFollow != null;
    }

    public List<UserFollow> getAllFollows(Long followerID) {
        return userFollowRepository.findByFollowerID(followerID);
    }

    public List<UserFollow> getAllFollowings(Long followedID) {
        return userFollowRepository.findByFollowingID(followedID);
    }

    //Calculate total of following and follower
    public Long countFollowing(Long id) {
        return Long.valueOf(userFollowRepository.countFollowing(id));
    }

    public Long countFollower(Long followedID) {
        return Long.valueOf(userFollowRepository.countFollowers(followedID));
    }

    public Map<String, ?> getAllInformationById(Long Id) {
        Map<String, Object> followInformation = new HashMap<>();
        followInformation.put("getAllFollows", getAllFollows(Id));
        followInformation.put("getAllFollowings", getAllFollowings(Id));
        followInformation.put("following", countFollowing(Id));
        followInformation.put("follower", countFollower(Id));
        return followInformation;
    }

    public List<String> getFollowedUsers(Long id) {
        return userFollowRepository.getAllFollowedIdByFollowerId(id);
    }
}
