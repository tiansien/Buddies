package com.example.backend.services;

import com.example.backend.entities.*;
import com.example.backend.repositories.EventRepository;
import com.example.backend.repositories.NotificationRepository;
import com.example.backend.repositories.ParticipationRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.services.email.EmailService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.BeanFactoryUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ParticipationService {
    @Autowired
    private ParticipationRepository participationRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private WebSocketNotificationService webSocketNotificationService;

    public List<Participation> getAllParticipantsByEventId(Integer eventId) {
        return participationRepository.findAllParticipantsByEventId(eventId);
    }

    public List<Participation> getAllParticipants() {
        return participationRepository.findAllParticipants();
    }

    public Participation addParticipant(Long Id, Integer eventId ,Participation participation) {
//        User user = userRepository.findById(Id).orElseThrow(() -> new IllegalStateException("User not found"));
//        participation.setAppUser(user);
//        Event event = eventRepository.findById((long)eventId).orElseThrow(() -> new IllegalStateException("Event not found"));
//        participation.setEvent(event);
        participation.setAppUser(userRepository.findById(Id).orElseThrow(() -> new IllegalStateException("User not found")));
        participation.setEvent(eventRepository.findById((long)eventId).orElseThrow(() -> new IllegalStateException("Event not found")));
        participation.setStatus("pending");
        return participationRepository.save(participation);
    }

    public Participation participantsStatus(Integer eventId, Integer userId) {
        Participation participation = participationRepository.findParticipantsStatusByEventIdandUserId(eventId, userId);
        return participation;
    }

    public Participation approveParticipant(Integer participationId) {
        Participation participation = participationRepository.findById(participationId).orElseThrow(() -> new IllegalStateException("Participant not found"));
        participation.setStatus("approved");
        participationRepository.save(participation);

        Event event = participation.getEvent();
        String email = participation.getAppUser().getEmail();
        String subject = "Participation Approved";
        String body = createApprovalHtmlBody(participation.getAppUser().getLogin(), event.getTitle());

        System.out.println("event:    " + event.getUserId().intValue());

        emailService.sendHtmlEmail(email, subject, body);

        String userIdNoti = participation.getAppUser().getId().toString();
        Notification notification = createNotificationForApproveAndReject(Integer.parseInt(userIdNoti), participation.getEvent().getEventId().intValue(), event.getUserId().intValue(), "APPROVE");
        webSocketNotificationService.notifyUser(userIdNoti, notification);


        return participation;
    }

    private Notification createNotificationForApproveAndReject(Integer id, Integer referenceId, Integer fromId, String type) {
        Notification notification = new Notification();
        notification.setAppUser(userRepository.findById(id.longValue()).orElseThrow(() -> new RuntimeException("User not found")));        notification.setContent("Your post got a new like!");
        notification.setType(type);
        notification.setIsRead("N");
        notification.setTimestamp(LocalDateTime.now());
        notification.setReferenceID(referenceId);
        notification.setContent("Your participation has been " + type + " for the event");
        notification.setFromId(userRepository.findById(fromId.longValue()).orElseThrow(() -> new RuntimeException("User not found")));
        notificationRepository.save(notification);
        return notification;
    }

    private String createApprovalHtmlBody(String username, String eventTitle) {
        return "<!DOCTYPE html><html><head><style>.email-body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }.header { color: green; font-size: 18px; }.content { margin-top: 20px; }</style></head><body><div class='email-body'><p class='header'>Participation Approved</p><p class='content'>Dear " + username + ",<br><br>Congratulations! Your application to participate in the event '" + eventTitle + "' has been APPROVED.<br><br>We are excited to have you join us and look forward to your participation.<br><br>Best Regards,<br>Event Team</p></div></body></html>";
    }


    public Participation rejectParticipantWithReason(Integer participationId, String rejectReason) {
        return participationRepository.findById(participationId).map(participation -> {
            participation.setStatus("rejected");
            participation.setRejectReason(rejectReason);
            participationRepository.save(participation);

            Event event = participation.getEvent();
            String email = participation.getAppUser().getEmail();
            String subject = "Participation Rejected";
            String body = createRejectionHtmlBody(participation.getAppUser().getLogin(), event.getTitle());

            emailService.sendHtmlEmail(email, subject, body);

            String userIdNoti = participation.getAppUser().getId().toString();
            Notification notification = createNotificationForApproveAndReject(Integer.parseInt(userIdNoti), participation.getEvent().getEventId().intValue(), participation.getEvent().getUserId().intValue(), "REJECT");
            webSocketNotificationService.notifyUser(userIdNoti, notification);

            return participation;
        }).orElseThrow(() -> new IllegalStateException("Participant not found"));
    }


    public Participation rejectParticipant(Integer participationId) {
        return participationRepository.findById(participationId).map(participation -> {
            participation.setStatus("rejected");
            participationRepository.save(participation);

            Event event = participation.getEvent();
            String email = participation.getAppUser().getEmail();
            String subject = "Participation Rejected";
            String body = createRejectionHtmlBody(participation.getAppUser().getLogin(), event.getTitle());

            emailService.sendHtmlEmail(email, subject, body);

            String userIdNoti = participation.getAppUser().getId().toString();
            Notification notification = createNotificationForApproveAndReject(Integer.parseInt(userIdNoti), participation.getEvent().getEventId().intValue(), participation.getEvent().getUserId().intValue(), "REJECT");
            webSocketNotificationService.notifyUser(userIdNoti, notification);

            return participation;
        }).orElseThrow(() -> new IllegalStateException("Participant not found"));
    }

    private String createApprovalEmailBody(String username, String eventTitle) {
        return "Dear " + username + ",\n\n" +
                "Congratulations! Your application to participate in the event '" + eventTitle + "' has been APPROVED. \n\n" +
                "We are excited to have you join us and look forward to your participation.\n\n" +
                "Best Regards,\n" +
                "Event Team";
    }

    private String createRejectionEmailBody(String username, String eventTitle) {
        return "Dear " + username + ",\n\n" +
                "Thank you for your interest in the event '" + eventTitle + "'. After careful consideration, we regret to inform you that your application has not been approved(Rejected) at this time.\n\n" +
                "We appreciate your interest and encourage you to apply for future events.\n\n" +
                "Best Regards,\n" +
                "Event Team";
    }

    private String createRejectionHtmlBody(String username, String eventTitle) {
        return "<!DOCTYPE html><html><head><style>.email-body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }.header { color: red; font-size: 18px; }.content { margin-top: 20px; }</style></head><body><div class='email-body'><p class='header'>Participation Rejected</p><p class='content'>Dear " + username + ",<br><br>Thank you for your interest in the event '" + eventTitle + "'. After careful consideration, we regret to inform you that your application has not been approved at this time.<br><br>We appreciate your interest and encourage you to apply for future events.<br><br>Best Regards,<br>Event Team</p></div></body></html>";
    }


    public List<Participation> getAllRequestParticipantById(Long userId) {
        return participationRepository.findAllRequestParticipantsByUserId(userId);
    }

}
