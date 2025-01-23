package com.example.backend.repositories;

import com.example.backend.entities.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Integer> {

    @Query("SELECT p FROM Participation p WHERE p.event.eventId = :eventId AND p.appUser.id = :userId")
    Participation findParticipantsStatusByEventIdandUserId(Integer eventId, Integer userId);

    @Query("SELECT p FROM Participation p WHERE p.event.eventId = :eventId")
    List<Participation> findAllParticipantsByEventId(Integer eventId);

    @Query("SELECT p FROM Participation p")
    List<Participation> findAllParticipants();

    @Query("SELECT p FROM Participation p WHERE p.event.eventId = :eventId")
    List<Participation> findAllParticipantsByEventId(Long eventId);

    @Query("SELECT p FROM Participation p WHERE p.event.eventId = :eventId AND p.status = 'approved'")
    List<Participation> findAllParticipantsByEventIdAndApproved(Long eventId);

    @Query("SELECT p FROM Participation p WHERE p.appUser.id = :userId")
    List<Participation> findAllRequestParticipantsByUserId(Long userId);

}
