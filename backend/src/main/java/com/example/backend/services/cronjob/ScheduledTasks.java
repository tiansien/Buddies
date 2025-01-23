package com.example.backend.services.cronjob;

import com.example.backend.entities.Event;
import com.example.backend.entities.Participation;
import com.example.backend.entities.User;
import com.example.backend.repositories.EventRepository;
import com.example.backend.repositories.ParticipationRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.services.email.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Slf4j
public class ScheduledTasks {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ParticipationRepository participationRepository;

//    @Scheduled(cron = "0 0 12 * * ?") // Runs at 12 PM daily
//    public void scheduledEmailTask() {
//        List<String> users = userRepository.findAllEmail();
//        List<Event> events = eventRepository.findAll();
//        log.info("Starting scheduled email task");
//        emailService.sendEmail(
//                "recipient@example.com",
//                "Scheduled Email",
//                "This is a scheduled email sent at " + LocalDateTime.now()
//        );
//    }


//    @Scheduled(cron = "0 30 15 * * ?")  // Runs at 3:30 PM daily
    @Scheduled(cron = "0 0 0 * * ?")  // Runs at 12:00 daily
    public void sendReminderForUpcomingEvents() {
        // Get target date only (3 days from now)
        LocalDate targetDate = LocalDate.now().plusDays(1);

        // Convert LocalDate to start and end of day in java.util.Date
        Date startOfDay = Date.from(targetDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endOfDay = Date.from(targetDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).minusSeconds(1).toInstant());

        log.info("Checking for events on date: {}", targetDate);

        // Find events on the target date
        List<Event> upcomingEvents = eventRepository.findByDateBetween(startOfDay, endOfDay);

        if (upcomingEvents.isEmpty()) {
            log.info("No upcoming events found for date: {}", targetDate);
            return;
        }

        for (Event event : upcomingEvents) {
            List<Participation> participants = participationRepository.findAllParticipantsByEventIdAndApproved(event.getEventId());

            if (participants.isEmpty()) {
                log.info("No participants found for event: {}", event.getTitle());
                continue;
            }

            List<String> emails = participants.stream()
                    .map(participation -> participation.getAppUser().getEmail())
                    .filter(email -> email != null && !email.isEmpty())
                    .collect(Collectors.toList());

            String subject = "Reminder: Upcoming Event - " + event.getTitle();
            String body = createReminderEmailBody(event);

            for (String email : emails) {
                try {
                    emailService.sendHtmlEmail(email, subject, body);
                    log.info("Sent reminder email for event '{}' to {}", event.getTitle(), email);
                } catch (Exception e) {
                    log.error("Failed to send reminder email to {} for event {}", email, event.getTitle(), e);
                }
            }
        }
    }

    private String createReminderEmailBody(Event event) {
        return "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"></head><body style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\">" +
                "<div style=\"background-color: #f8f9fa; padding: 20px; border-radius: 10px;\">" +
                "<h1 style=\"color: #1a73e8; text-align: center;\">Event Reminder</h1>" +
                "<div style=\"background-color: white; padding: 20px; border-radius: 5px; margin-top: 20px;\">" +
                "<h2 style=\"color: #202124; margin-bottom: 20px;\">" + event.getTitle() + "</h2>" +
                "<div style=\"border-left: 4px solid #1a73e8; padding-left: 15px; margin: 15px 0;\">" +
                "<p style=\"margin: 5px 0;\"><strong>Date:</strong> " + event.getDate() + "</p>" +
                "<p style=\"margin: 5px 0;\"><strong>Location:</strong> " + event.getLocation() + "</p>" +
                "<p style=\"margin: 5px 0;\"><strong>Type:</strong> " + event.getEventType() + "</p>" +
                "</div>" +
                "<div style=\"background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;\">" +
                "<h3 style=\"color: #202124; margin-top: 0;\">Description</h3>" +
                "<p style=\"margin: 0;\">" + event.getDescription() + "</p>" +
                "</div>" +
                "<div style=\"background-color: #e8f0fe; padding: 15px; border-radius: 5px; margin: 20px 0;\">" +
                "<h3 style=\"color: #1a73e8; margin-top: 0;\">Important Reminders</h3>" +
                "<ul style=\"margin: 10px 0; padding-left: 20px;\">" +
                "<li style=\"margin: 5px 0;\">Please arrive 10 minutes early</li>" +
                "<li style=\"margin: 5px 0;\">Bring your ID</li>" +
                "<li style=\"margin: 5px 0;\">Consider carpooling</li>" +
                "</ul>" +
                "</div>" +
                "<div style=\"text-align: center; margin-top: 30px;\">" +
                "<p style=\"color: #5f6368; font-size: 0.9em;\">We're looking forward to seeing you!</p>" +
                "</div>" +
                "</div>" +
                "<div style=\"text-align: center; margin-top: 20px; color: #5f6368; font-size: 0.8em;\">" +
                "<p>This is an automated reminder. Please do not reply to this email.</p>" +
                "</div>" +
                "</div>" +
                "</body></html>";
    }


}
