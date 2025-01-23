package com.example.backend.entities;

import com.example.backend.entities.User;
import com.example.backend.entities.Event;
import jakarta.persistence.*;

@Entity
@Table(name = "PARTICIPATION")
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer participationID;

    @ManyToOne
    @JoinColumn(name = "ID", nullable = false)
    private User appUser;

    @ManyToOne
    @JoinColumn(name = "EventID", nullable = false)
    private Event event;

    @Column(name = "ROLE", nullable = false)
    private String role;

    @Column(name = "STATUS", nullable = false)
    private String status;

    @Column(name = "APPLYREASON", nullable = true)
    private String applyReason;

    @Column(name = "REJECTEASON", nullable = true)
    private String rejectReason;

    // Getters and Setters


    public Integer getParticipationID() {
        return participationID;
    }

    public void setParticipationID(Integer participationID) {
        this.participationID = participationID;
    }

    public User getAppUser() {
        return appUser;
    }

    public void setAppUser(User appUser) {
        this.appUser = appUser;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getApplyReason() {
        return applyReason;
    }

    public void setApplyReason(String applyReason) {
        this.applyReason = applyReason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRejectReason() {
        return rejectReason;
    }

    public void setRejectReason(String rejectReason) {
        this.rejectReason = rejectReason;
    }
}
