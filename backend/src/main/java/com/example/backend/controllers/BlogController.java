package com.example.backend.controllers;

import com.example.backend.dtos.BlogDto;
import com.example.backend.dtos.combine.BlogWithProfileDto;
import com.example.backend.entities.Blog;
import com.example.backend.services.BlogService;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {
    @Autowired
    private BlogService blogService;

//    @GetMapping
//    public List<Blog> getAllBlogs(@RequestParam(value = "userId", required = false) Integer userId) {
//        return blogService.getAllBlogs(userId);
//    }

    @GetMapping(value = "/allblogs")
    public ResponseEntity<List<BlogWithProfileDto>> getAllBlogs(@RequestParam(value = "userId", required = false) Integer userId) {
        return ResponseEntity.ok(blogService.getAllBlogsWithProfiles(userId));
    }

    @GetMapping(value = "/allblogstesting")
    public ResponseEntity<List<?>> getAllBlogsTest(@RequestParam(value = "userId", required = false) Integer userId) {
        return ResponseEntity.ok(blogService.getAllBlogsWithProfilesTest(userId));
    }

    @GetMapping(value = "/getAllBlogsWithProfilesFollowed")
    public ResponseEntity<List<?>> getAllBlogsWithProfilesFollowed(@RequestParam(value = "userId") Long userId) {
        return ResponseEntity.ok(blogService.getAllBlogsWithProfilesFollowed(userId));
    }



    @GetMapping(value = "/allblogswithprofileuser")
    public ResponseEntity<List<?>> getAllBlogsWithProfileUser(@RequestParam(value = "userId", required = false) Integer userId) {
        return ResponseEntity.ok(blogService.getAllBlogsWithProfilesUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<Object>> getBlogById(@PathVariable Integer id) {
        List<Object> userProfile = blogService.getBlogById(id);
        return ResponseEntity.ok(userProfile);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public Blog createBlog(@RequestBody Blog blog, @RequestPart("files") MultipartFile[] files) {
        return blogService.createBlog(blog, files);
    }

    @PostMapping(value = "/createblog", consumes = {"multipart/form-data"})
    public Blog createBlog2(@RequestPart("blogDto") BlogDto blogDto, @RequestPart("files") MultipartFile[] files) {
        return blogService.createBlog(blogDto, files);
    }

    @PostMapping(value = "/test")
    public Blog createBlogWithFileName(@RequestBody BlogDto blogDto, @RequestParam("filename") String filename) {
        // Log the filename received to check if it has been passed correctly
        System.out.println("Received filename: " + filename);

        // Pass the filenames and blog to the service to handle the rest
        return blogService.createBlogFilename(blogDto, filename);
    }

//    @PutMapping(value = "/{blogId}", consumes = {"multipart/form-data"})
//    public Blog updateBlog(@PathVariable Integer blogId, @RequestBody Blog updatedBlog, @RequestPart("files") MultipartFile[] files) {
//        return blogService.updateBlog(blogId, updatedBlog, files);
//    }

//    @DeleteMapping("/{blogId}")
//    public void deleteBlog(@PathVariable Integer blogId) {
//        blogService.deleteBlog(blogId);
//    }

    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Blog> updateBlog(
            @RequestPart("blogDto") String blogDtoJson,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            @RequestPart(value = "existingImages", required = false) String existingImagesJson
    ) {
        System.out.println("Blog DTO: " + blogDtoJson);
        System.out.println("Existing Images JSON: " + existingImagesJson);
        try {
            ObjectMapper mapper = new ObjectMapper();
            BlogDto blogDto = mapper.readValue(blogDtoJson, BlogDto.class);
            String[] existingImages = null;

            if (existingImagesJson != null) {
                existingImages = mapper.readValue(existingImagesJson, String[].class);
                System.out.println("Parsed Existing Images: " + Arrays.toString(existingImages));
            }

            // Log the files array
            if (files != null) {
                System.out.println("Files: " + Arrays.toString(files));
            }

            // Validate that at least one image is present
            if ((existingImages == null || existingImages.length == 0)
                    && (files == null || files.length == 0)) {
                return ResponseEntity.badRequest().body(null);
            }

            Blog updatedBlog = blogService.updateBlog(blogDto, files, existingImages);
            System.out.println("Updated Blog: " + updatedBlog);
            return ResponseEntity.ok(updatedBlog);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{blogId}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long blogId) {
        blogService.deleteBlog(blogId.intValue());
        return ResponseEntity.noContent().build();
    }
}

