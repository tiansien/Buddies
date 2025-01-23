package com.example.backend.dtos;

import java.util.Date;
import java.util.List;

public class EventDto {

    private Long eventId;
    private Long userId;
    private String title;
    private Date date;
    private Date applyDueDate;
    private String location;
    private String description;
    private String eventType;
    private List<String> eventPictureUrls;  // URLs for accessing images via API

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

    public List<String> getEventPictureUrls() {
        return eventPictureUrls;
    }

    public void setEventPictureUrls(List<String> eventPictureUrls) {
        this.eventPictureUrls = eventPictureUrls;
    }

    public Date getApplyDueDate() {
        return applyDueDate;
    }

    public void setApplyDueDate(Date applyDueDate) {
        this.applyDueDate = applyDueDate;
    }
}
