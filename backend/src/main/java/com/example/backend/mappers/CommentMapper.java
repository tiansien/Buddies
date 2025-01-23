package com.example.backend.mappers;

import com.example.backend.dtos.CommentDto;
import com.example.backend.entities.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CommentMapper {
    CommentMapper INSTANCE = Mappers.getMapper(CommentMapper.class);

    CommentDto toDTO(Comment comment);

    Comment toEntity(CommentDto commentDTO);
}
