package com.example.backend.dtos;

public class ParticipationDto {
    private Integer participationID;
    private Integer appUserID;
    private Integer eventID;
    private String role;

    // Getters and Setters

    public Integer getParticipationID() {
        return participationID;
    }

    public void setParticipationID(Integer participationID) {
        this.participationID = participationID;
    }

    public Integer getAppUserID() {
        return appUserID;
    }

    public void setAppUserID(Integer appUserID) {
        this.appUserID = appUserID;
    }

    public Integer getEventID() {
        return eventID;
    }

    public void setEventID(Integer eventID) {
        this.eventID = eventID;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
