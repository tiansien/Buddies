package com.example.backend.services;


import ch.qos.logback.core.joran.util.beans.BeanUtil;
import com.example.backend.dtos.BlogDto;
import com.example.backend.dtos.combine.BlogWithProfileDto;
import com.example.backend.entities.Blog;
import com.example.backend.entities.Profile;
import com.example.backend.entities.User;
import com.example.backend.repositories.BlogRepository;
import com.example.backend.repositories.ProfileRepository;
import com.example.backend.repositories.UserRepository;
import org.springframework.beans.BeanInfoFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.beans.BeanInfo;
import java.beans.Beans;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BlogService {
    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private UserFollowService userFollowService;

    public List<Blog> getAllBlogs(Integer userId) {
        if (userId != null) {
            return blogRepository.findAll().stream().filter(blog -> blog.getAppUser().getId().equals(userId)).toList();
        }
        return blogRepository.findAll();
    }

    public List<BlogWithProfileDto> getAllBlogsWithProfiles(Integer userId) {
        List<BlogWithProfileDto> profileWithBlog = new ArrayList<>();
        if (userId != null) {
            BlogWithProfileDto dto = new BlogWithProfileDto();
            Profile profile = profileService.getProfileById(userId).orElse(null);
            dto.setProfile(profile);
            getBlogById(userId).forEach(blog -> {
                dto.setBlog((Blog) blog);
                profileWithBlog.add(dto);
            });
        } else {
            blogRepository.findAll().forEach(blog -> {
                profileService.getProfileById(blog.getAppUser().getId().intValue()).ifPresent(profile -> {
                    BlogWithProfileDto dto = new BlogWithProfileDto();
                    dto.setBlog(blog);
                    dto.setProfile(profile);
                    profileWithBlog.add(dto);
                });
            });
        }

        return profileWithBlog;
    }

    public List<?> getAllBlogsWithProfilesTest(Integer userId) {
        List<Object> profileWithBlog = new ArrayList<>();
        if (userId != null) {
            Map<String, List> dto = new HashMap<>();
            Profile profile = profileService.getProfileById(userId).orElse(null);
            dto.put("profile", List.of(profile));
            dto.put("blog", blogRepository.findAllByUserId(userId));
            profileWithBlog.add(dto);
        } else {
            blogRepository.findAllByOrderByTimestampDesc().forEach(blog -> {
                profileService.getProfileById(blog.getAppUser().getId().intValue()).ifPresent(profile -> {
                    BlogWithProfileDto dto = new BlogWithProfileDto();
                    dto.setBlog(blog);
                    dto.setProfile(profile);
                    profileWithBlog.add(dto);
                });
            });
        }

        return profileWithBlog;
    }

    public List<?> getAllBlogsWithProfilesFollowed(Long userId) {
        List<Object> profileWithBlog = new ArrayList<>();
        List<String> followedUsers = userFollowService.getFollowedUsers(userId);
        blogRepository.findAllByOrderByTimestampDescByIds(followedUsers).forEach(blog -> {
            profileService.getProfileById(blog.getAppUser().getId().intValue()).ifPresent(profile -> {
                BlogWithProfileDto dto = new BlogWithProfileDto();
                dto.setBlog(blog);
                dto.setProfile(profile);
                profileWithBlog.add(dto);
            });
        });

        return profileWithBlog;
    }

    public List<?> getAllBlogsWithProfilesUser(Integer userId) {
        List<Object> profileWithBlog = new ArrayList<>();
        if (userId != null) {
            Map<String, List> dto = new HashMap<>();
            User user = userRepository.findById(userId.longValue()).orElse(null);
            Profile profile = profileService.getProfileById(userId).orElse(null);
            dto.put("user", List.of(user));
            dto.put("profile", List.of(profile));
            dto.put("blog", blogRepository.findAllByUserId(userId));
            profileWithBlog.add(dto);
        } else {
            blogRepository.findAllByOrderByTimestampDesc().forEach(blog -> {
                profileService.getProfileById(blog.getAppUser().getId().intValue()).ifPresent(profile -> {
                    BlogWithProfileDto dto = new BlogWithProfileDto();
                    dto.setBlog(blog);
                    dto.setProfile(profile);
                    profileWithBlog.add(dto);
                });
            });
        }

        return profileWithBlog;
    }

    public List<Object> getBlogById(Integer id) {
        List<Object> profileWithBlog = new ArrayList<>();
        Blog blog = blogRepository.findById(id).orElse(null);
        blog.getAppUser().setPassword(null);
        profileWithBlog.add(blog);
        profileWithBlog.add(profileService.getUserAndProfileById(blog.getAppUser().getId().intValue()));
        return profileWithBlog;
    }

    public Blog createBlog(Blog blog, MultipartFile[] files) {
        String fileNames = Arrays.stream(files)
                .map(file -> fileStorageService.storeFile("Blog",file))
                .collect(Collectors.joining(","));
        blog.setPostPicturePath(fileNames);
        return blogRepository.save(blog);
    }

    public Blog createBlog(BlogDto blogDto, MultipartFile[] files) {
        String fileNames = Arrays.stream(files)
                .map(file -> fileStorageService.storeFile("Blog",file))
                .collect(Collectors.joining(","));
        Blog blog = new Blog();
        userRepository.findById(blogDto.getId()).ifPresent(blog::setAppUser);
        blog.setPostDescription(blogDto.getPostDescription());
        blog.setPostDescription2(blogDto.getPostDescription2());
        blog.setPostTitle(blogDto.getPostTitle());
        blog.setTimestamp(LocalDateTime.now());
        blog.setPostPicturePath(fileNames);
        return blogRepository.save(blog);
    }

    public Blog createBlogFilename(BlogDto Blogdto, String filename) {
        Blog blog = new Blog();
        userRepository.findById(Blogdto.getId()).ifPresent(blog::setAppUser);
        blog.setPostDescription(Blogdto.getPostDescription());
        blog.setPostDescription2(Blogdto.getPostDescription2());
        blog.setPostTitle(Blogdto.getPostTitle());
        blog.setTimestamp(LocalDateTime.now());
        blog.setPostPicturePath(filename);
        return blogRepository.save(blog);
    }

    public Blog updateBlog(Integer blogId, Blog updatedBlog, MultipartFile[] files) {
        return blogRepository.findById(blogId).map(blog -> {
            blog.setPostDescription(updatedBlog.getPostDescription());
            blog.setPostDescription2(updatedBlog.getPostDescription2());
            String fileNames = Arrays.stream(files)
                    .map(file -> fileStorageService.storeFile("Blog",file))
                    .collect(Collectors.joining(","));
            blog.setPostPicturePath(fileNames);
            return blogRepository.save(blog);
        }).orElse(null);
    }

    public void deleteBlog(Integer blogId) {
        blogRepository.deleteById(blogId);
    }

    public Blog updateBlog(BlogDto blogDto, MultipartFile[] files) {
        return blogRepository.findById(blogDto.getId().intValue()).map(blog -> {
            blog.setPostDescription(blogDto.getPostDescription());
            blog.setPostDescription2(blogDto.getPostDescription2());
            blog.setPostTitle(blogDto.getPostTitle());
            String fileNames = Arrays.stream(files)
                    .map(file -> fileStorageService.storeFile("Blog", file))
                    .collect(Collectors.joining(","));
            blog.setPostPicturePath(fileNames);
            return blogRepository.save(blog);
        }).orElse(null);
    }

    public Blog updateBlog(BlogDto blogDto, MultipartFile[] newFiles, String[] existingImages) {
        return blogRepository.findBlogByIdd(Integer.parseInt(blogDto.getBlogId()))
                .map(blog -> {
                    blog.setPostDescription(blogDto.getPostDescription());
                    blog.setPostDescription2(blogDto.getPostDescription2());
                    blog.setPostTitle(blogDto.getPostTitle());

                    // Handle image paths
                    List<String> finalImagePaths = new ArrayList<>();

                    // Add existing images that should be kept
                    if (existingImages != null) {
                        for (String existingImage : existingImages) {
                            // Extract filename from the full URL
                            System.out.println("Existing image: " + existingImage);
                            String filename = existingImage.substring(existingImage.lastIndexOf('/') + 1);
                            System.out.println("Filename: " + filename);
                            finalImagePaths.add(filename);
                        }
                    }

                    // Add new uploaded files
                    if (newFiles != null) {
                        List<String> newFilePaths = Arrays.stream(newFiles)
                                .map(file -> fileStorageService.storeFile("Blog", file))
                                .collect(Collectors.toList());
                        finalImagePaths.addAll(newFilePaths);
                    }

                    // Join all paths and update the blog
                    blog.setPostPicturePath(String.join(",", finalImagePaths));
                    return blogRepository.save(blog);
                })
                .orElse(null);
    }
}
