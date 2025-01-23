package com.example.backend.controllers;

import com.example.backend.entities.Participation;
import com.example.backend.services.ParticipationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events/participants")
public class ParticipationController {
    @Autowired
    private ParticipationService participationService;

    @GetMapping
    public List<Participation> getAllParticipantsByEventId(@RequestParam Integer eventId) {
        return participationService.getAllParticipantsByEventId(eventId);
    }

    @GetMapping("/all")
    public List<Participation> getAllParticipants() {
        return participationService.getAllParticipants();
    }

    @PutMapping("/add")
    public Participation addParticipant(@RequestParam Long id, @RequestParam Integer eventId, @RequestBody Participation participation) {
        return participationService.addParticipant(id, eventId, participation);
    }

    @GetMapping("/{eventId}/{userId}")
    public Participation participantsStatus(@PathVariable Integer eventId, @PathVariable Integer userId) {
        return participationService.participantsStatus(eventId, userId);
    }

    @PutMapping("/{participationId}/approve")
    public Participation approveParticipant(@PathVariable Integer participationId) {
        return participationService.approveParticipant(participationId);
    }

    @PutMapping("/{participationId}/rejectWithReason")
    public Participation rejectParticipantWithReason(@PathVariable Integer participationId, @RequestBody String rejectReason) {
        return participationService.rejectParticipantWithReason(participationId, rejectReason);
    }

    @PutMapping("/{participationId}/reject")
    public Participation rejectParticipant(@PathVariable Integer participationId) {
        return participationService.rejectParticipant(participationId);
    }

    @GetMapping("/requests/{userId}")
    public List<Participation> getAllRequestParticipantsByUserId(@PathVariable Long userId) {
        return participationService.getAllRequestParticipantById(userId);
    }


}
