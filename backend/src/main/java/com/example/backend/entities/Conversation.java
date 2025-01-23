package com.example.backend.entities;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "CONVERSATION")
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer conversationID;

    @Column(name = "CONVERSATIONNAME", nullable = false)
    private String conversationName;

    @Column(name = "ISGROUP", nullable = false, columnDefinition = "CHAR(1) DEFAULT 'N' CHECK (ISGROUP IN ('Y', 'N'))")
    private String isGroup;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupMember> groupMembers;

//    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Message> messages;

    // Getters and Setters

    public Integer getConversationID() {
        return conversationID;
    }

    public void setConversationID(Integer conversationID) {
        this.conversationID = conversationID;
    }

    public String getConversationName() {
        return conversationName;
    }

    public void setConversationName(String conversationName) {
        this.conversationName = conversationName;
    }

    public String getIsGroup() {
        return isGroup;
    }

    public void setIsGroup(String isGroup) {
        this.isGroup = isGroup;
    }

    public List<GroupMember> getGroupMembers() {
        return groupMembers;
    }

    public void setGroupMembers(List<GroupMember> groupMembers) {
        this.groupMembers = groupMembers;
    }

//    public List<Message> getMessages() {
//        return messages;
//    }
//
//    public void setMessages(List<Message> messages) {
//        this.messages = messages;
//    }
}
