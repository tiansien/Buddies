package com.example.backend.dtos;

public class UserFollowDto {
    private Integer followID;
    private Integer appUserID;
    private Integer followedUserID;

    // Getters and Setters

    public Integer getFollowID() {
        return followID;
    }

    public void setFollowID(Integer followID) {
        this.followID = followID;
    }

    public Integer getAppUserID() {
        return appUserID;
    }

    public void setAppUserID(Integer appUserID) {
        this.appUserID = appUserID;
    }

    public Integer getFollowedUserID() {
        return followedUserID;
    }

    public void setFollowedUserID(Integer followedUserID) {
        this.followedUserID = followedUserID;
    }
}

