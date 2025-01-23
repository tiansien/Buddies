package com.example.backend.dtos;

import java.time.LocalDateTime;

public class LikesDto {
    private Integer likeID;
    private String type;
    private Integer referenceID;
    private Integer appUserID;
    private LocalDateTime timestamp;

    // Getters and Setters

    public Integer getLikeID() {
        return likeID;
    }

    public void setLikeID(Integer likeID) {
        this.likeID = likeID;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getReferenceID() {
        return referenceID;
    }

    public void setReferenceID(Integer referenceID) {
        this.referenceID = referenceID;
    }

    public Integer getAppUserID() {
        return appUserID;
    }

    public void setAppUserID(Integer appUserID) {
        this.appUserID = appUserID;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

}
