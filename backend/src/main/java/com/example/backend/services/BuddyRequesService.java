package com.example.backend.services;

import com.example.backend.entities.BuddyRequest;
import com.example.backend.entities.Profile;
import com.example.backend.entities.User;
import com.example.backend.repositories.BuddyRequestRepository;
import com.example.backend.repositories.ProfileRepository;
import com.example.backend.repositories.UserFollowRepository;
import com.example.backend.repositories.UserRepository;
import jakarta.persistence.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BuddyRequesService {

    @Autowired
    private UserFollowRepository userFollowRepository;

    @Autowired
    private BuddyRequestRepository buddyRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

//    public BuddyRequest sendBuddyRequest(BuddyRequest buddyRequest) {
//        buddyRequest.setStatus("Pending");
//        return buddyRequestRepository.save(buddyRequest);
//    }

    public BuddyRequest sendBuddyRequest(Long appUserId, Long receivedId) {
        BuddyRequest buddyRequest = new BuddyRequest();
        User appUser = userRepository.findById(appUserId).
                orElseThrow(() -> new IllegalStateException("User not found"));
        buddyRequest.setAppUser(appUser);
        User receivedUser = userRepository.findById(receivedId).
                orElseThrow(() -> new IllegalStateException("User not found"));
        buddyRequest.setReceiver(receivedUser);
        buddyRequest.setStatus("pending");
        buddyRequest.setRequestDate(java.time.LocalDateTime.now());
        return buddyRequestRepository.save(buddyRequest);
    }

    public BuddyRequest updateBuddyRequestStatus(Integer requestID, String status) {
        return buddyRequestRepository.findById(requestID).map(buddyRequest -> {
            buddyRequest.setStatus(status);
            return buddyRequestRepository.save(buddyRequest);
        }).orElse(null);
    }

    public void deleteBuddyRequest(Integer requestID) {
        buddyRequestRepository.deleteById(requestID);
    }

    public List<BuddyRequest> getAllBuddyRequestById(Long userID) {
        User user = userRepository.findById(userID).orElse(null);
        String userRole = user.getRole();
        List<BuddyRequest> buddyRequests = new ArrayList<>();
        if(userRole == "Admin") {
            buddyRequests = buddyRequestRepository.findAll();
        }
        return buddyRequests;
    }

    public List<?> getAllUserProfile() {
        return profileRepository.findAll();
    }

    public List<Map<String, Object>> getAllUserAndProfile() {
        List<Map<String, Object>> userAndProfile = new ArrayList<>();
        List<User> user = userRepository.findAll();
        for (User u : user) {
            Map<String, Object> userAndProfiletemp = new HashMap<>();
            Profile profile = profileRepository.findById(u.getId().intValue()).orElse(null);
            userAndProfiletemp.put("user", u);
            userAndProfiletemp.put("profile", profile);
            userAndProfile.add(userAndProfiletemp);
        }
        return userAndProfile;
    }

    public List<Map<String, Object>> getAllUserAndProfileExceptMe(Long userId) {
        List<Map<String, Object>> userAndProfile = new ArrayList<>();
        List<User> user = userRepository.findAllExceptMeAndAdmin(userId);
        for (User u : user) {
            Map<String, Object> userAndProfiletemp = new HashMap<>();
            Profile profile = profileRepository.findById(u.getId().intValue()).orElse(null);
            userAndProfiletemp.put("user", u);
            userAndProfiletemp.put("profile", profile);
            userAndProfile.add(userAndProfiletemp);
        }
        return userAndProfile;
    }



    public List<Map<String, Object>> getAllUserAndProfile(int page, int size) {
        List<Map<String, Object>> userAndProfile = new ArrayList<>();

        // Use PageRequest to get paginated data
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.findAll(pageable);

        for (User u : userPage.getContent()) {
            Map<String, Object> userAndProfileTemp = new HashMap<>();
            Profile profile = profileRepository.findById(u.getId().intValue()).orElse(null);
            userAndProfileTemp.put("user", u);
            userAndProfileTemp.put("profile", profile);
            userAndProfile.add(userAndProfileTemp);
        }

        return userAndProfile;
    }

    // Add method to get total pages
    public long getTotalPages(int size) {
        long totalUsers = userRepository.count();
        return (totalUsers + size - 1) / size; // Calculate total pages
    }


    public BuddyRequest approveBuddyRequest(Integer requestID, Long userID) {
        User user = userRepository.findById(userID).orElse(null);
        if (user.getRole() == "Admin") {
            return buddyRequestRepository.findById(requestID).map(buddyRequest -> {
                buddyRequest.setStatus("accepted");
                return buddyRequestRepository.save(buddyRequest);
            }).orElse(null);
        }
        throw new IllegalStateException("User is not authorized to approve the request");
    }

    public List<BuddyRequest> getAllBuddyRequestByReceivedID(Long receivedId){
        List<BuddyRequest> allRequestBuddyByReceivedId = new ArrayList<>();
        allRequestBuddyByReceivedId = buddyRequestRepository.findByReceivedId(receivedId);
        return allRequestBuddyByReceivedId;
    }

    public BuddyRequest approveBuddyRequestByRequestID(Integer requestID) {
        BuddyRequest buddyRequest = buddyRequestRepository.findById(requestID).orElse(null);
        if (buddyRequest == null) {
            throw new IllegalStateException("Buddy request not found");
        }
        buddyRequest.setStatus("accepted");
        User user = userRepository.findById(buddyRequest.getReceiver().getId()).orElse(null);
        if (user == null) {
            throw new IllegalStateException("User not found");
        }
        if (user.getBuddy() == null || user.getBuddy().isEmpty()) {
            user.setBuddy(buddyRequest.getAppUser().getId().toString());
        } else {
            String[] buddies = user.getBuddy().split(",");
            if (buddies.length < 1) {
                user.setBuddy(user.getBuddy() + "," + buddyRequest.getAppUser().getId().toString());
            } else {
                throw new IllegalStateException("User can only have up to 1 buddies");
            }
        }
        userRepository.save(user);
        return buddyRequestRepository.save(buddyRequest);
    }

    public BuddyRequest rejectBuddyRequestByRequestID(Integer requestID){
        BuddyRequest buddyRequest = buddyRequestRepository.findById(requestID).orElse(null);
        buddyRequest.setStatus("rejected");
        return buddyRequestRepository.save(buddyRequest);
    }

    public List<User> getBuddyByUserID(Long userID){
        List<User> buddiesUserProfile = new ArrayList<>();
        User user = userRepository.findById(userID).orElse(null);
        List<User> buddies = new ArrayList<>();
        if (user.getBuddy() != null) {
            String[] buddyIds = user.getBuddy().split(",");
            for (String buddyId : buddyIds) {
                User buddy = userRepository.findById(Long.parseLong(buddyId)).orElse(null);
                buddies.add(buddy);
                buddiesUserProfile.add(buddy);
            }
        }
        return buddiesUserProfile;
    }

    public BuddyRequest getBuddyRequestStatus(Long userId, Long receivedId) {
        BuddyRequest buddyRequest = buddyRequestRepository.findByAppUserIdAndReceivedId(userId, receivedId);
        return buddyRequest;
    }

    public Boolean checkingStatusOverall(Long userId){
        List<BuddyRequest> buddyRequest = buddyRequestRepository.findByAppUserId(userId);
        List allRequestStatus = new ArrayList();
        if(buddyRequest != null){
            buddyRequest.forEach(request -> {
                allRequestStatus.add(request.getStatus());
            });
            if(allRequestStatus.contains("accepted") || allRequestStatus.contains("pending")){
                return false;
            }else
                return true;
        }
        return true;
    }

    public List<BuddyRequest> getAllRequest(Long userId){
        List<BuddyRequest> buddyRequest = buddyRequestRepository.findByAppUserId(userId);
        return buddyRequest;
    }

    public List<BuddyRequest> getAllRequestReceived(Long receivedId){
        List<BuddyRequest> buddyRequest = buddyRequestRepository.findByReceivedId(receivedId);
        return buddyRequest;
    }

    public BuddyRequest deleteBuddyRequestByRequestID(Integer requestID) {
        BuddyRequest buddyRequest = buddyRequestRepository.findById(requestID).orElse(null);
        buddyRequestRepository.delete(buddyRequest);
        return buddyRequest;
    }

}


