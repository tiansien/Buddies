package com.example.backend.controllers;

import com.example.backend.dtos.ProfileDto;
import com.example.backend.dtos.UserDto;
import com.example.backend.entities.Profile;
import com.example.backend.entities.User;
import com.example.backend.mappers.ProfileMapper;
import com.example.backend.repositories.UserRepository;
import com.example.backend.services.ProfileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {
    @Autowired
    private ProfileService profileService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Profile> getAllProfiles() {
        return profileService.getAllProfiles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profile> getProfileById(@PathVariable int id) {
        return profileService.getProfileById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/getUserAndProfileById/{id}")
    public ResponseEntity<List<Object>> getUserAndProfileById(@PathVariable int id) {
        List<Object> userProfile = profileService.getUserAndProfileById(id);
        return ResponseEntity.ok(userProfile);
    }

    @PostMapping
    public ResponseEntity<Profile> createProfile(@RequestBody ProfileDto profileDto) {
        Profile profile = ProfileMapper.INSTANCE.toEntity(profileDto);
        return new ResponseEntity<>(profileService.createProfile(profile), HttpStatus.CREATED);
    }

    @GetMapping("/getUserProfile/{id}")
    public Boolean getHaveUserProfile(@PathVariable int id) {
        Profile userProfile = profileService.getUserProfile(id);
        System.out.println("userProfile != null " + userProfile != null);
        return userProfile != null;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profile> updateProfile(@PathVariable int id, @RequestBody ProfileDto profileDto) {
        Profile updatedProfile = ProfileMapper.INSTANCE.toEntity(profileDto);
        return ResponseEntity.ok(profileService.updateProfile(id, updatedProfile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable int id) {
        profileService.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }

//    Api using for UPDATE/CREATE private Profile and UPDATE User database
//    @PutMapping(value="/updateProfileAndUser/{id}/profilePicture", consumes = "multipart/form-data")
//    public ResponseEntity<?> updateProfileAndUser(
//            @PathVariable int id,
//            @RequestPart("profileDto") ProfileDto profileDto,
//            @RequestPart("userDto") UserDto userDto,
//            @RequestPart("profilePicture") MultipartFile profilePicture) {
//
//        Profile updatedProfile = ProfileMapper.INSTANCE.toEntity(profileDto);
//        profileService.updateProfileAndUser(id, userDto, updatedProfile, profilePicture);
//        return ResponseEntity.noContent().build();
//    }

    @PutMapping(value="/updateProfileAndUser/{id}/profilePicture", consumes = "multipart/form-data")
    public ResponseEntity<?> updateProfileAndUser(
            @PathVariable int id,
            @RequestPart("profileDto") String profileDto,
            @RequestPart("userDto") String userDto,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {

        try {
            // Create ObjectMapper instance
            ObjectMapper objectMapper = new ObjectMapper();

            // Parse JSON strings into DTO objects
            ProfileDto parsedProfileDto = objectMapper.readValue(profileDto, ProfileDto.class);
            UserDto parsedUserDto = objectMapper.readValue(userDto, UserDto.class);

            // Log the yearOfStudy field
            System.out.println("Parsed yearOfStudy: " + parsedProfileDto.getYearOfStudy());

            // Log the results for debugging
            System.out.println("Parsed profileDto: " + parsedProfileDto);
            System.out.println("Parsed userDto: " + parsedUserDto);
//            System.out.println("Received profilePicture: " + profilePicture.getOriginalFilename());

            // Continue with your service logic
            Profile updatedProfile = ProfileMapper.INSTANCE.toEntity(parsedProfileDto);
            profileService.updateProfileAndUser(id, parsedUserDto, updatedProfile, profilePicture);

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid JSON format");
        }
    }

    public ResponseEntity<?> updateProfilePicture(@PathVariable int id, @RequestParam("profilePicture") MultipartFile profilePicture) {
        profileService.updateProfilePicture(id, profilePicture);
        return ResponseEntity.noContent().build();
    }

}
