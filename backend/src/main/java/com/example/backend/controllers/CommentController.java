package com.example.backend.controllers;

import com.example.backend.entities.Comment;
import com.example.backend.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @GetMapping
    public List<Comment> getAllComments(@RequestParam Integer referenceId, @RequestParam String type) {
        return commentService.getAllComments(referenceId, type);
    }

    @PostMapping
    public Comment addComment(@RequestBody Comment comment) {
        return commentService.addComment(comment);
    }

    @GetMapping("/withprofile")
    public Map<String, List<?>> getCommentWithProfile(@RequestParam Integer referenceId, @RequestParam String type) {
        return commentService.getCommentWithProfile(referenceId, type);
    }

    @GetMapping("/count")
    public String getTotalCommentCount(@RequestParam Integer referenceId, @RequestParam String type) {
        return commentService.getTotalCommentCount(referenceId, type);
    }
}
