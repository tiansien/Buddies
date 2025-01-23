package com.example.backend.dtos;

import java.time.LocalDateTime;

public class BuddyRequestDto {
    private Integer requestID;
    private Integer appUserID;
    private Integer receiverID;
    private String status;
    private LocalDateTime requestDate;

    // Getters and Setters

    public Integer getRequestID() {
        return requestID;
    }

    public void setRequestID(Integer requestID) {
        this.requestID = requestID;
    }

    public Integer getAppUserID() {
        return appUserID;
    }

    public void setAppUserID(Integer appUserID) {
        this.appUserID = appUserID;
    }

    public Integer getReceiverID() {
        return receiverID;
    }

    public void setReceiverID(Integer receiverID) {
        this.receiverID = receiverID;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }
}

