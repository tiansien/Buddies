package com.example.backend.services;

import com.example.backend.dtos.UserDto;
import com.example.backend.entities.Profile;
import com.example.backend.entities.User;
import com.example.backend.repositories.UserRepository;
import com.example.backend.repositories.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }

    public Optional<Profile> getProfileById(int id) {
        return profileRepository.findById(id);
    }

    public Profile createProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    public Profile updateProfile(int id, Profile updatedProfile) {
        return profileRepository.findById(id).map(profile -> {
            profile.setBio(updatedProfile.getBio());
            profile.setFac(updatedProfile.getFac());
            profile.setProgram(updatedProfile.getProgram());
            profile.setLevelOfStudy(updatedProfile.getLevelOfStudy());

            return profileRepository.save(profile);
        }).orElseGet(() -> {
            updatedProfile.setId(id);
            return profileRepository.save(updatedProfile);
        });
    }

    public Profile getUserProfile(Integer id) {
        return profileRepository.findById(id).orElse(null);
    }

    public void deleteProfile(int id) {
        profileRepository.deleteById(id);
    }

//    Api using for Update private Profile and User database
    public void updateProfileAndUser(int id, UserDto user, Profile updatedProfile, MultipartFile profilePicture) {
        Profile profile = profileRepository.findById(id).orElse(new Profile());
        profile.setId(id);
        profile.setBio(updatedProfile.getBio());
        profile.setFac(updatedProfile.getFac());
        profile.setProgram(updatedProfile.getProgram());
        System.out.println("setLevelOfStudy" + updatedProfile.getYearOfStudy());
//        profile.setLevelOfStudy(updatedProfile.getLevelOfStudy());
        profile.setYearOfStudy(updatedProfile.getYearOfStudy());
        profileRepository.save(profile);

        User existingUser = userRepository.findById((long) id).orElse(new User());
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setLogin(existingUser.getLogin());
        existingUser.setEmail(user.getEmail());
        userRepository.save(existingUser);

        if(profilePicture != null) {
            String profilePicturePath = fileStorageService.storeFile("User", profilePicture);
            userRepository.saveProfilePicture(profilePicturePath, (long)id);
        } else {
            existingUser.setProfilePhoto("defaultProfilePicture.jpg");
        }
    }

    public void updateProfilePicture(int id, MultipartFile profilePicture) {
        String profilePicturePath = fileStorageService.storeFile("User", profilePicture);
        userRepository.saveProfilePicture(profilePicturePath, (long)id);
    }

    public List<Object> getUserAndProfileById(int id) {
        List<Object> userProfile = new ArrayList<>();
        Optional<User> user = userRepository.findById((long) id);

//        Reformatting the profile picture path
        String profilePhoto = user.get().getProfilePhoto();
        String profilePicturePath = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/download/user/")
                .path(profilePhoto)
                .toUriString();
        user.get().setProfilePhoto(profilePicturePath);

        user.ifPresent(userProfile::add);
        profileRepository.findById(id).ifPresent(userProfile::add);
        return userProfile;
    }

    public List<Object> getUserAndProfileById2(int id) {
        List<Object> userProfile = new ArrayList<>();
        Optional<User> user = userRepository.findById((long) id);

        if (user.isPresent()) {
            String profilePhoto = user.get().getProfilePhoto();
            if (!profilePhoto.startsWith("http")) {
                String profilePicturePath = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/download/user/")
                        .path(profilePhoto)
                        .toUriString();
                user.get().setProfilePhoto(profilePicturePath);
            }
        }

        user.ifPresent(userProfile::add);
        profileRepository.findById(id).ifPresent(userProfile::add);
        return userProfile;
    }

}
