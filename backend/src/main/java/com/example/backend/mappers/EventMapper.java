package com.example.backend.mappers;

import com.example.backend.dtos.EventDto;
import com.example.backend.entities.Event;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface EventMapper {
    EventMapper INSTANCE = Mappers.getMapper(EventMapper.class);

    EventDto toDTO(Event event);

    Event toEntity(EventDto eventDTO);
}

