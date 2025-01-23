package com.example.backend.entities;

import com.example.backend.entities.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "BLOG")
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer blogID;

    @ManyToOne
    @JoinColumn(name = "ID", nullable = false)
    private User appUser;

    @Column(name = "POSTTITLE")
    private String postTitle;

    @Column(name = "POSTDESCRIPTION")
    @Lob
    private String postDescription;

    @Column(name = "POSTDESCRIPTION2")
    @Lob
    private String postDescription2;

    @Column(name = "POSTPICTUREPATH")
    private String postPicturePath;


    public String getPostTitle() {
        return postTitle;
    }

    public void setPostTitle(String postTitle) {
        this.postTitle = postTitle;
    }

    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime timestamp;

    // Getters and Setters
    public Integer getBlogID() {
        return blogID;
    }

    public void setBlogID(Integer blogID) {
        this.blogID = blogID;
    }

    public User getAppUser() {
        return appUser;
    }

    public void setAppUser(User appUser) {
        this.appUser = appUser;
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
}

