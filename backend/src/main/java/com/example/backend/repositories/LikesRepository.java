package com.example.backend.repositories;

import com.example.backend.entities.Likes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LikesRepository extends JpaRepository<Likes, Integer> {

    @Query("SELECT l FROM Likes l WHERE l.appUser.id = :userId AND l.type = :type AND l.referenceID = :referenceId")
    Likes findByUserIdAndTypeAndReferenceId(Integer userId, String type, Integer referenceId);


    @Query("SELECT l FROM Likes l WHERE l.referenceID = :referenceId AND l.type = :type")
    Likes findByReferenceIdAndType(Integer referenceId, String type);

    @Query("SELECT COUNT(l) FROM Likes l WHERE l.referenceID = :referenceId AND l.type = :type")
    Integer calculateLikes(Integer referenceId, String type);
}