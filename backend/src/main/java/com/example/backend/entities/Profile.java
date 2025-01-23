package com.example.backend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "PROFILE")
public class Profile {

    @Id
    private int id;

    private String bio;
    private String fac;
    private String program;

    @Column(name = "LEVELOFSTUDY")
    private String levelOfStudy;

    @Column(name = "YEAROFSTUDY")
    private String yearOfStudy;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getFac() {
        return fac;
    }

    public void setFac(String fac) {
        this.fac = fac;
    }

    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    public String getLevelOfStudy() {
        return levelOfStudy;
    }

    public void setLevelOfStudy(String levelOfStudy) {
        this.levelOfStudy = levelOfStudy;
    }

    public String getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(String yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }
}

