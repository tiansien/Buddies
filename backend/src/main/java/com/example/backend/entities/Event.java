package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "event")
public class Event {

    @Id
    @Column(name = "EVENT_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    @Column(name = "USER_ID")
    private Long userId; // User ID who created the event

    @Column(name = "TITLE")
    private String title; // Title of the event directly stored as a string

    @Column(name = "EVENT_DATE")
    private Date date;

    @Column(name = "APPLY_DUE_DATE", nullable = true)
    private Date applyDueDate;

    @Column(name = "LOCATION")
    private String location;


    @Column(name = "DESCRIPTION", columnDefinition = "CLOB")
    private String description;

    @Column(name = "EVENT_TYPE")
    private String eventType;

    @Column(name = "EVENT_PICTURE_PATHS")
    private String eventPicturePaths;  // Stores multiple image paths separated by commas

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getEventPicturePaths() {
        return eventPicturePaths;
    }

    public void setEventPicturePaths(String eventPicturePaths) {
        this.eventPicturePaths = eventPicturePaths;
    }

    public Date getApplyDueDate() {
        return applyDueDate;
    }

    public void setApplyDueDate(Date applyDueDate) {
        this.applyDueDate = applyDueDate;
    }
}
