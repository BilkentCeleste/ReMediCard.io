package com.celeste.remedicard.io.autogeneration.dto;

import com.celeste.remedicard.io.autogeneration.config.DataType;
import com.celeste.remedicard.io.autogeneration.config.Language;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@AllArgsConstructor
@Builder
@Data
public class DataProcessingTask implements Serializable {
    private Long id;
    private Long userId;
    private String fileName;
    private String address;
    private DataType dataType;
    private Language language;
}