package com.example.backend.mappers;

import com.example.backend.dtos.NotificationDto;
import com.example.backend.entities.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface NotificationMapper {
    NotificationMapper INSTANCE = Mappers.getMapper(NotificationMapper.class);

    NotificationDto toDTO(Notification notification);

    Notification toEntity(NotificationDto notificationDTO);
}
