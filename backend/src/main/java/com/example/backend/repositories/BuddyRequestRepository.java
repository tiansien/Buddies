package com.example.backend.repositories;

import com.example.backend.entities.BuddyRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BuddyRequestRepository extends JpaRepository<BuddyRequest, Integer> {

//    @Query("SELECT br FROM BuddyRequest br WHERE br.receiver = :receivedId")
//    List<BuddyRequest> findByReceivedId(Long receivedId);

    @Query("SELECT br FROM BuddyRequest br WHERE br.appUser.id = :appUserId AND br.receiver.id = :receivedId")
    BuddyRequest findByAppUserIdAndReceivedId(Long appUserId, Long receivedId);

    @Query("SELECT br FROM BuddyRequest br WHERE br.appUser.id = :appUserId ORDER BY br.requestDate DESC")
    List<BuddyRequest> findByAppUserId(Long appUserId);

    @Query("SELECT br FROM BuddyRequest br WHERE br.receiver.id = :receivedId ORDER BY br.requestDate DESC")
    List<BuddyRequest> findByReceivedId(Long receivedId);

}