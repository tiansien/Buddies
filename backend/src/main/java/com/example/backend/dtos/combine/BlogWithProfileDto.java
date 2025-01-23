package com.example.backend.dtos.combine;

import com.example.backend.entities.Blog;
import com.example.backend.entities.Profile;

public class BlogWithProfileDto {

    private Blog blog;
    private Profile profile;

    public Blog getBlog() {
        return blog;
    }

    public void setBlog(Blog blog) {
        this.blog = blog;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }
}
