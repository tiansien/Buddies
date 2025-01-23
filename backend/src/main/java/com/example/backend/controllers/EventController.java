package com.example.backend.controllers;

import com.example.backend.dtos.EventDto;
import com.example.backend.entities.Event;
import com.example.backend.services.EventService;
import com.example.backend.services.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private FileStorageService fileStorageService;

    private static final Logger logger = LoggerFactory.getLogger(EventController.class);

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> addEvent(@RequestPart("event") EventDto eventDto,
                                      @RequestPart("files") MultipartFile[] files) {
        try {
            logger.info("Received event data: {}", eventDto);
            logger.info("Received files count: {}", files.length);

            if (files == null || files.length == 0) {
                return ResponseEntity.badRequest().body("File upload error: No files provided");
            }
            logger.info("Received files: {}", Arrays.toString(files));
            logger.info("Received Event Title: {}", eventDto.getTitle());
            logger.info("Received Event Date: {}", eventDto.getDate());
            logger.info("Received Event Location: {}", eventDto.getLocation());
            logger.info("Received Event Description: {}", eventDto.getDescription());
            logger.info("Received Event Type: {}", eventDto.getEventType());
            logger.info("Received Event Apply Due Date: {}", eventDto.getApplyDueDate());

            Event event = convertDtoToEntity(eventDto);
            logger.info("This is after convertDtoToEntity", event);
            Event savedEvent = eventService.saveEvent(event, files);

            List<String> fileUrls = Arrays.stream(files)
                    .map(file -> ServletUriComponentsBuilder.fromCurrentContextPath()
                            .path("/download/event/")
                            .path(file.getOriginalFilename())
                            .toUriString())
                    .collect(Collectors.toList());

            eventDto.setEventPictureUrls(fileUrls);
            return ResponseEntity.ok(savedEvent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding event: " + e.getMessage());
        }
    }

    // Helper method to convert DTO to entity
    private Event convertDtoToEntity(EventDto eventDto) {
        Event event = new Event();
        event.setUserId(eventDto.getUserId());
        event.setTitle(eventDto.getTitle());
        logger.info("This is after setting title", event);
        event.setDate(eventDto.getDate());  // Consider enhancing date handling
        logger.info("This is after setting date", event);
        event.setLocation(eventDto.getLocation());
        event.setDescription(eventDto.getDescription());
        event.setEventType(eventDto.getEventType());
        event.setApplyDueDate(eventDto.getApplyDueDate());
        return event;
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDto> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        EventDto eventDTO = new EventDto();
        eventDTO.setEventId(event.getEventId());
        eventDTO.setUserId(event.getUserId());
        eventDTO.setTitle(event.getTitle());
        eventDTO.setDate(event.getDate());
        eventDTO.setLocation(event.getLocation());
        eventDTO.setDescription(event.getDescription());
        eventDTO.setEventType(event.getEventType());
        eventDTO.setApplyDueDate(event.getApplyDueDate());
        eventDTO.setEventPictureUrls(Arrays.stream(event.getEventPicturePaths().split(","))
                .map(fileName -> ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/download/event/")
                        .path(fileName)
                        .toUriString())
                .collect(Collectors.toList()));
        return ResponseEntity.ok(eventDTO);
    }

    @GetMapping
    public ResponseEntity<List<EventDto>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        List<EventDto> eventDTOs = events.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(eventDTOs);
    }

    private EventDto convertToDto(Event event) {
        EventDto dto = new EventDto();
        dto.setEventId(event.getEventId());
        dto.setUserId(event.getUserId());
        dto.setTitle(event.getTitle());
        dto.setDate(event.getDate());
        dto.setLocation(event.getLocation());
        dto.setDescription(event.getDescription());
        dto.setEventType(event.getEventType());
        dto.setApplyDueDate(event.getApplyDueDate());
        dto.setEventPictureUrls(Arrays.stream(event.getEventPicturePaths().split(","))
                .map(fileName -> ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/download/event/")
                        .path(fileName)
                        .toUriString())
                .collect(Collectors.toList()));
        return dto;
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileStorageService.loadFileAsResource("Event", fileName);

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            contentType = "application/octet-stream";  // Fallback content type
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }


    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Event> updateEvent(
            @PathVariable("id") Long id,
            @RequestPart("event") String eventJson,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            @RequestPart(value = "existingImages", required = false) String existingImagesJson) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Event event = mapper.readValue(eventJson, Event.class);

            String[] existingImages = mapper.readValue(existingImagesJson, String[].class);

            Event updatedEvent = eventService.updateEvent(event, files, existingImages);
            return ResponseEntity.ok(updatedEvent);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }


}
