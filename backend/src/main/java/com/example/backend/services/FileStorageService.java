package com.example.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // Normalize file name
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        // Append a UUID to file name to ensure uniqueness
        String fileExtension = fileName.substring(fileName.lastIndexOf("."));
        String savedFileName = UUID.randomUUID().toString() + fileExtension;
        try {
            if (fileName.contains("..")) {
                throw new IllegalStateException("Sorry! Filename contains invalid path sequence " + fileName);
            }
            Path targetLocation = this.fileStorageLocation.resolve(savedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return savedFileName;
        } catch (IOException ex) {
            throw new IllegalStateException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new IllegalStateException("File not found " + fileName);
            }
        } catch (IOException ex) {
            throw new IllegalStateException("File not found " + fileName, ex);
        }
    }

    public String storeFile(String folderName, MultipartFile file) {
        // Normalize file name
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        // Append a UUID to file name to ensure uniqueness
        String fileExtension = fileName.substring(fileName.lastIndexOf("."));
        String savedFileName = UUID.randomUUID().toString() + fileExtension;
        try {
            if (fileName.contains("..")) {
                throw new IllegalStateException("Sorry! Filename contains invalid path sequence " + fileName);
            }
            Path targetLocation = this.fileStorageLocation.resolve(folderName).resolve(savedFileName);
            Files.createDirectories(targetLocation.getParent());
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return savedFileName;
        } catch (IOException ex) {
            throw new IllegalStateException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String folderName, String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(folderName).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new IllegalStateException("File not found " + fileName);
            }
        } catch (IOException ex) {
            throw new IllegalStateException("File not found " + fileName, ex);
        }
    }


}
