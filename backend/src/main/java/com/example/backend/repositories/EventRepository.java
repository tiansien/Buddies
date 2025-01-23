package com.example.backend.repositories;

import com.example.backend.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {


    @Query("SELECT e FROM Event e WHERE e.date = :date")
    List<Event> findByDate(Timestamp date);

    @Query("SELECT e FROM Event e WHERE DATE(e.date) = :targetDate")
    List<Event> findByDateOnly(@Param("targetDate") java.sql.Date targetDate);

    @Query("SELECT e FROM Event e WHERE e.date >= :startDate AND e.date < :endDate")
    List<Event> findByDateBetween(@Param("startDate") Date startDate, @Param("endDate") Date endDate);


    @Query("SELECT e FROM Event e WHERE e.eventId = :eventId")
    Optional<Event> findByEventId(Long eventId);
}
