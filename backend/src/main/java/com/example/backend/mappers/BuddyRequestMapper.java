package com.example.backend.mappers;

import com.example.backend.dtos.BuddyRequestDto;
import com.example.backend.entities.BuddyRequest;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface BuddyRequestMapper {
    BuddyRequestMapper INSTANCE = Mappers.getMapper(BuddyRequestMapper.class);

    BuddyRequestDto toDTO(BuddyRequest buddyRequest);

    BuddyRequest toEntity(BuddyRequestDto buddyRequestDTO);
}