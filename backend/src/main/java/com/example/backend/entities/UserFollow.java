package com.example.backend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "USER_FOLLOW")
public class UserFollow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer followID;

//    @ManyToOne
//    @JoinColumn(name = "ID", nullable = false)
//    private User appUser;
//
    @Column(name = "ID", nullable = false)
    private Long id;

//    @ManyToOne
//    @JoinColumn(name = "FollowedID", nullable = false)
//    private User followedUser;


    @Column(name = "FollowedID", nullable = false)
    private Long followedId;

    // Getters and Setters

    public Integer getFollowID() {
        return followID;
    }

    public void setFollowID(Integer followID) {
        this.followID = followID;
    }

//    public User getAppUser() {
//        return appUser;
//    }
//
//    public void setAppUser(User appUser) {
//        this.appUser = appUser;
//    }
//
//    public User getFollowedUser() {
//        return followedUser;
//    }
//
//    public void setFollowedUser(User followedUser) {
//        this.followedUser = followedUser;
//    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFollowedId() {
        return followedId;
    }

    public void setFollowedId(Long followedId) {
        this.followedId = followedId;
    }
}

