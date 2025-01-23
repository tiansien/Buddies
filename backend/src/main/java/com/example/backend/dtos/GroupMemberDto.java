package com.example.backend.dtos;

public class GroupMemberDto {
    private Integer groupMemberID;
    private Integer appUserID;
    private Integer conversationID;
    private String role;

    // Getters and Setters

    public Integer getGroupMemberID() {
        return groupMemberID;
    }

    public void setGroupMemberID(Integer groupMemberID) {
        this.groupMemberID = groupMemberID;
    }

    public Integer getAppUserID() {
        return appUserID;
    }

    public void setAppUserID(Integer appUserID) {
        this.appUserID = appUserID;
    }

    public Integer getConversationID() {
        return conversationID;
    }

    public void setConversationID(Integer conversationID) {
        this.conversationID = conversationID;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
