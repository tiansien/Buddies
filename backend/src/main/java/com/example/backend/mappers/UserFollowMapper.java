package com.example.backend.mappers;

import com.example.backend.dtos.UserFollowDto;
import com.example.backend.entities.UserFollow;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserFollowMapper {
    UserFollowMapper INSTANCE = Mappers.getMapper(UserFollowMapper.class);

    UserFollowDto toDTO(UserFollow userFollow);

    UserFollow toEntity(UserFollowDto userFollowDTO);
}
