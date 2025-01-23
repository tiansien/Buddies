package com.example.backend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "GROUP_MEMBER")
public class GroupMember {
    @Id
    @Column(name = "GROUPMEMBERID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer groupMemberID;

    @ManyToOne
    @JoinColumn(name = "ID", nullable = false)
    private User appUser;

    @ManyToOne
    @JoinColumn(name = "ConversationID", nullable = false)
    private Conversation conversation;

    @Column(nullable = false)
    private String role;

    // Getters and Setters

    public Integer getGroupMemberID() {
        return groupMemberID;
    }

    public void setGroupMemberID(Integer groupMemberID) {
        this.groupMemberID = groupMemberID;
    }

    public User getAppUser() {
        return appUser;
    }

    public void setAppUser(User appUser) {
        this.appUser = appUser;
    }

    public Conversation getConversation() {
        return conversation;
    }

    public void setConversation(Conversation conversation) {
        this.conversation = conversation;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

}

