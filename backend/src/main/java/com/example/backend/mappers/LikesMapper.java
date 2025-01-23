package com.example.backend.mappers;

import com.example.backend.dtos.LikesDto;
import com.example.backend.entities.Likes;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface LikesMapper {
    LikesMapper INSTANCE = Mappers.getMapper(LikesMapper.class);

    LikesDto toDTO(Likes likes);

    Likes toEntity(LikesDto likesDTO);
}
