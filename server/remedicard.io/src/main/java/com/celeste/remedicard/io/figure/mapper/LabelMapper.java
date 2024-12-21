package com.celeste.remedicard.io.figure.mapper;

import com.celeste.remedicard.io.figure.controller.dto.LabelResponseDTO;
import com.celeste.remedicard.io.figure.entity.Label;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface LabelMapper {

    LabelMapper INSTANCE = Mappers.getMapper(LabelMapper.class);

    LabelResponseDTO toDTO(Label label);
}