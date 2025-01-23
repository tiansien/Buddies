package com.example.backend.controllers;

import com.example.backend.entities.BuddyRequest;
import com.example.backend.entities.User;
import com.example.backend.services.BuddyRequesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/buddyrequest")
public class BuddyRequestController {


    @Autowired
    private BuddyRequesService buddyRequesService;

    @PutMapping("/updateBuddyRequest/{requestID}")
    public BuddyRequest updateBuddyRequestStatus(@PathVariable Integer requestID, @RequestBody String status) {
        return buddyRequesService.updateBuddyRequestStatus(requestID, status);
    }

    @DeleteMapping("/deleteBuddyRequest/{requestID}")
    public void deleteBuddyRequest(@PathVariable Integer requestID) {
        buddyRequesService.deleteBuddyRequest(requestID);
    }

    @GetMapping("/getAllBuddyRequestById/{userID}")
    public List<BuddyRequest> getAllBuddyRequestById(@PathVariable Long userID) {
        return buddyRequesService.getAllBuddyRequestById(userID);
    }

    @GetMapping("/getAllUserProfile")
    public List<Map<String, Object>> getAllUserProfile() {
        return buddyRequesService.getAllUserAndProfile();
    }

    @GetMapping("/getAllUserProfileExceptMe/{userId}")
    public List<Map<String, Object>> getAllUserProfileExceptMe(@PathVariable Long userId) {
        return buddyRequesService.getAllUserAndProfileExceptMe(userId);
    }

    @GetMapping("/getAllUserProfile2")
    public ResponseEntity<Map<String, Object>> getAllUserProfile(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<Map<String, Object>> userProfiles = buddyRequesService.getAllUserAndProfile(page, size);
        long totalPages = buddyRequesService.getTotalPages(size);

        Map<String, Object> response = new HashMap<>();
        response.put("data", userProfiles);
        response.put("currentPage", page);
        response.put("totalPages", totalPages);
        response.put("pageSize", size);

        return ResponseEntity.ok(response);
    }



    @PostMapping("/requests/{requestID}/approve")
    public ResponseEntity<BuddyRequest> approveBuddyRequest(@PathVariable Integer requestID, @AuthenticationPrincipal User user) {
        try {
            BuddyRequest approvedRequest = buddyRequesService.approveBuddyRequest(requestID, user.getId());
            return ResponseEntity.ok(approvedRequest);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/sendBuddyRequest")
    public ResponseEntity<BuddyRequest> sendBuddyRequest(@RequestParam Long appUserId, @RequestParam Long receivedId) {
        try {
            BuddyRequest buddyRequest = buddyRequesService.sendBuddyRequest(appUserId, receivedId);
            return ResponseEntity.status(HttpStatus.CREATED).body(buddyRequest);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }




    @PutMapping("/requests/{requestID}/approveByRequestID")
    public ResponseEntity<BuddyRequest> approveBuddyRequestByRequestID(@PathVariable Integer requestID) {
        try {
            BuddyRequest approvedRequest = buddyRequesService.approveBuddyRequestByRequestID(requestID);
            return ResponseEntity.ok(approvedRequest);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/requests/{requestID}/rejectByRequestID")
    public ResponseEntity<BuddyRequest> rejectBuddyRequestByRequestID(@PathVariable Integer requestID) {
        try {
            BuddyRequest rejectedRequest = buddyRequesService.rejectBuddyRequestByRequestID(requestID);
            return ResponseEntity.ok(rejectedRequest);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/buddies/{userID}")
    public ResponseEntity<List<User>> getBuddyByUserID(@PathVariable Long userID) {
        List<User> buddies = buddyRequesService.getBuddyByUserID(userID);
        if (buddies.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(buddies);
    }

    @GetMapping("/requests/status")
    public BuddyRequest getBuddyRequestStatus(@RequestParam Long userId, @RequestParam Long receivedId) {
        BuddyRequest buddyRequest = buddyRequesService.getBuddyRequestStatus(userId, receivedId);
        return buddyRequest;
    }

    @GetMapping("/requests/checkStatusOverall/{userId}")
    public ResponseEntity<Boolean> checkingStatusOverall(@PathVariable Long userId) {
        Boolean status = buddyRequesService.checkingStatusOverall(userId);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/requests/{userId}")
    public List<BuddyRequest> getAllRequest(@PathVariable Long userId) {
        List<BuddyRequest> buddyRequests = buddyRequesService.getAllRequest(userId);
        return buddyRequests;
    }

    @GetMapping("/requests/received/{receivedId}")
    public List<BuddyRequest> getAllRequestReceived(@PathVariable Long receivedId) {
        List<BuddyRequest> buddyRequests = buddyRequesService.getAllRequestReceived(receivedId);
        return buddyRequests;
    }

    @DeleteMapping("/requests/{requestID}")
    public ResponseEntity<BuddyRequest> deleteBuddyRequestByRequestID(@PathVariable Integer requestID) {
        BuddyRequest buddyRequest = buddyRequesService.deleteBuddyRequestByRequestID(requestID);
        if (buddyRequest == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(buddyRequest);
    }




}
