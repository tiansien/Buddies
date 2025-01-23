package com.example.backend.repositories;

import com.example.backend.entities.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Integer> {
    @Query("SELECT b FROM Blog b WHERE b.appUser.id = :userId ORDER BY b.timestamp DESC")
    List<Blog> findAllByUserId(@Param("userId") Integer userId);

    @Query("SELECT b FROM Blog b ORDER BY b.timestamp DESC")
    List<Blog> findAllByOrderByTimestampDesc();

    @Query("SELECT b FROM Blog b WHERE b.appUser.id IN :followedUsers ORDER BY b.timestamp DESC")
    List<Blog> findAllByOrderByTimestampDescByIds(List<String> followedUsers);

    @Query("SELECT b FROM Blog b WHERE b.blogID = :blogId")
    Blog findBlogById(Integer blogId);


    @Query("SELECT b FROM Blog b WHERE b.blogID = :blogId")
    Optional<Blog> findBlogByIdd(Integer blogId);
}
