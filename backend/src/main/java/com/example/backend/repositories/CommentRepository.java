package com.example.backend.repositories;

import com.example.backend.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {


    @Query("SELECT c FROM Comment c WHERE c.referenceID = :referenceId AND c.type = :type ORDER BY c.timestamp ASC ")
    List<Comment> findAllByReferenceIdAndType(Integer referenceId, String type);




}
