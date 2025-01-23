package com.example.backend.mappers;

import com.example.backend.dtos.BlogDto;
import com.example.backend.entities.Blog;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface BlogMapper {
    BlogMapper INSTANCE = Mappers.getMapper(BlogMapper.class);

    BlogDto toDTO(Blog blog);

    Blog toEntity(BlogDto blogDTO);
}

