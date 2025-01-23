package com.example.backend.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MESSAGE")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer messageID;

//    @ManyToOne
//    @JoinColumn(name = "ID", nullable = false)
//    private User appUser;

//    @ManyToOne
//    @JoinColumn(name = "ConversationID", nullable = false)
//    private Conversation conversation;

    @Column(name = "ConversationID", nullable = false)
    private Integer ConversationID;

    @Column(name = "FROMUSERID")
    private String fromUserId;

    @Column(nullable = false)
    private String content;

    @Column(name = "SENTDATETIME", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime sentDateTime;

    @Column(name = "READSTATUS")
    private String readStatus;

    // Getters and Setters

    public Integer getMessageID() {
        return messageID;
    }

    public void setMessageID(Integer messageID) {
        this.messageID = messageID;
    }

//    public User getAppUser() {
//        return appUser;
//    }
//
//    public void setAppUser(User appUser) {
//        this.appUser = appUser;
//    }

//    public Conversation getConversation() {
//        return conversation;
//    }
//
//    public void setConversation(Conversation conversation) {
//        this.conversation = conversation;
//    }


    public Integer getConversationID() {
        return ConversationID;
    }

    public void setConversationID(Integer conversationID) {
        ConversationID = conversationID;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getSentDateTime() {
        return sentDateTime;
    }

    public void setSentDateTime(LocalDateTime sentDateTime) {
        this.sentDateTime = sentDateTime;
    }

    public String getFromUserId() {
        return fromUserId;
    }

    public void setFromUserId(String fromUserId) {
        this.fromUserId = fromUserId;
    }

    public String getReadStatus() {
        return readStatus;
    }

    public void setReadStatus(String readStatus) {
        this.readStatus = readStatus;
    }
}
