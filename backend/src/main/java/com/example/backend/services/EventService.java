package com.example.backend.services;

import com.example.backend.entities.Event;
import com.example.backend.repositories.EventRepository;
import com.example.backend.services.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Event saveEvent(Event event, MultipartFile[] files) {
        String fileNames = Arrays.stream(files)
                .map(file -> fileStorageService.storeFile("Event", file))
                .collect(Collectors.joining(","));
        event.setEventPicturePaths(fileNames);
        return eventRepository.save(event);
    }

    public Event saveEventFolder(Event event, MultipartFile[] files) {
        String fileNames = Arrays.stream(files)
                .map(file -> fileStorageService.storeFile("Event",file))
                .collect(Collectors.joining(","));
        event.setEventPicturePaths(fileNames);
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElseThrow(() -> new IllegalStateException("Event not found"));
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }


    public Event updateEvent(Event event, MultipartFile[] newFiles, String[] existingImages) {
        return eventRepository.findByEventId(event.getEventId()).map(existingEvent -> {
            existingEvent.setTitle(event.getTitle());
            existingEvent.setDate(event.getDate());
            existingEvent.setLocation(event.getLocation());
            existingEvent.setDescription(event.getDescription());
            existingEvent.setEventType(event.getEventType());
            existingEvent.setApplyDueDate(event.getApplyDueDate());

            List<String> imagePaths = new ArrayList<>();
            if (event.getEventPicturePaths() != null && !event.getEventPicturePaths().isEmpty()) {
                imagePaths.addAll(Arrays.asList(event.getEventPicturePaths().split(",")));
            }

            if (existingImages != null) {
                for (String existingImage : existingImages) {
                    // Extract filename from the full URL
                    System.out.println("Existing image: " + existingImage);
                    String filename = existingImage.substring(existingImage.lastIndexOf('/') + 1);
                    System.out.println("Filename: " + filename);
                    imagePaths.add(filename);
                }
            }

            if (newFiles != null) {
                List<String> newFilePaths = Arrays.stream(newFiles)
                        .map(file -> fileStorageService.storeFile("Event", file))
                        .collect(Collectors.toList());
                imagePaths.addAll(newFilePaths);
            }

            existingEvent.setEventPicturePaths(String.join(",", imagePaths));
            return eventRepository.save(existingEvent);
        }).orElseThrow(() -> new IllegalStateException("Event not found with ID " + event.getEventId()));
    }



}
