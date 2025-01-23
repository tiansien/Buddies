package com.example.backend.dtos;

import java.time.LocalDateTime;

public class BlogDto {
    private Integer blogID;
    private Integer appUserID;

    private Long id;

    private String postTitle;

    private String postDescription;
    private String postDescription2;
    private String postPicturePath;
    private LocalDateTime timestamp;

    private String blogId;

    // Getters and Setters
    public Integer getBlogID() {
        return blogID;
    }

    public String getPostTitle() {
        return postTitle;
    }

    public void setPostTitle(String postTitle) {
        this.postTitle = postTitle;
    }

    public void setBlogID(Integer blogID) {
        this.blogID = blogID;
    }

    public Integer getAppUserID() {
        return appUserID;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setAppUserID(Integer appUserID) {
        this.appUserID = appUserID;
    }

    public String getPostDescription() {
        return postDescription;
    }

    public void setPostDescription(String postDescription) {
        this.postDescription = postDescription;
    }

    public String getPostDescription2() {
        return postDescription2;
    }

    public void setPostDescription2(String postDescription2) {
        this.postDescription2 = postDescription2;
    }

    public String getPostPicturePath() {
        return postPicturePath;
    }

    public void setPostPicturePath(String postPicturePath) {
        this.postPicturePath = postPicturePath;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getBlogId() {
        return blogId;
    }

    public void setBlogId(String blogId) {
        this.blogId = blogId;
    }
}
