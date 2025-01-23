package com.example.backend.mappers;

import com.example.backend.dtos.ParticipationDto;
import com.example.backend.entities.Participation;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ParticipationMapper {
    ParticipationMapper INSTANCE = Mappers.getMapper(ParticipationMapper.class);

    ParticipationDto toDTO(Participation participation);

    Participation toEntity(ParticipationDto participationDTO);
}
