package com.example.backend.mappers;


import com.example.backend.dtos.GroupMemberDto;
import com.example.backend.entities.GroupMember;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface GroupMemberMapper {
    GroupMemberMapper INSTANCE = Mappers.getMapper(GroupMemberMapper.class);

    GroupMemberDto toDTO(GroupMember groupMember);

    GroupMember toEntity(GroupMemberDto groupMemberDTO);
}

