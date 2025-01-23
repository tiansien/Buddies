package com.example.backend.repositories;

import com.example.backend.entities.UserFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserFollowRepository extends JpaRepository<UserFollow, Integer> {

    @Query("SELECT u FROM UserFollow u WHERE u.id = :id AND u.followedId = :followedID")
    UserFollow findByFollowerIDAndFollowingID(Long id, Long followedID);

    @Query("SELECT u FROM UserFollow u WHERE u.id = :id")
    List<UserFollow> findByFollowerID(Long id);

    @Query("SELECT u FROM UserFollow u WHERE u.followedId = :followedID")
    List<UserFollow> findByFollowingID(Long followedID);

    @Query("SELECT COUNT(u) FROM UserFollow u WHERE u.id = :id")
    Long countFollowing(@Param("id") Long id);

    @Query("SELECT COUNT(u) FROM UserFollow u WHERE u.followedId = :followedID")
    Long countFollowers(Long followedID);

    @Modifying
    @Query("DELETE FROM UserFollow u WHERE u.id = :id AND u.followedId = :followedID")
    void deleteFollowWithIdFollowedId(@Param("id") Long id, @Param("followedID") Long followedID);

//    void deleteByFollowerIDAndFollowingID(Long followerID, Long followingID);

    @Query("SELECT u FROM UserFollow u WHERE u.id = :id")
    List<UserFollow> getAllFollowContactsById(Long id);

    @Query("SELECT u FROM UserFollow u WHERE u.followedId = :followedID")
    List<UserFollow> getAllFollowersById(Long followedID);

    @Query("SELECT u.followedId FROM UserFollow u WHERE u.id = :id")
    List<String> getAllFollowedIdByFollowerId(Long id);



}
