package com.example.backend.mappers;

import com.example.backend.dtos.ProfileDto;
import com.example.backend.entities.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    ProfileMapper INSTANCE = Mappers.getMapper(ProfileMapper.class);

    @Mapping(target = "id", ignore = true)
    Profile toEntity(ProfileDto profileDto);

    @Mapping(source = "yearOfStudy", target = "yearOfStudy")
    ProfileDto toDto(Profile profile);

    ProfileDto toDTO(Profile profile);
}
