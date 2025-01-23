package com.example.backend.repositories;

import com.example.backend.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByLogin(String login);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.profilePhoto = :profilePicturePath WHERE u.id = :id")
    void saveProfilePicture(String profilePicturePath, long id);

    @Query("SELECT u.email FROM User u")
    List<String> findAllEmail();

    @Query("SELECT u FROM User u WHERE u.id != :id")
    List<User> findAllExceptMe(Long id);

    @Query("SELECT u FROM User u WHERE u.id != :id AND u.id IN (SELECT id FROM User WHERE role IS NULL OR role != 'admin')")
    List<User> findAllExceptMeAndAdmin(Long id);

    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(String email);

}
