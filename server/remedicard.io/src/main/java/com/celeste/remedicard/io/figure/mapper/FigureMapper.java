package com.celeste.remedicard.io.figure.mapper;

import com.celeste.remedicard.io.figure.controller.dto.FigureResponseDTO;
import com.celeste.remedicard.io.figure.entity.Figure;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface FigureMapper {

    FigureMapper INSTANCE = Mappers.getMapper(FigureMapper.class);

    FigureResponseDTO toDTO(Figure figure);
}