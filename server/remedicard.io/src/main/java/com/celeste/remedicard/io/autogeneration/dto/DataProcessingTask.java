package com.celeste.remedicard.io.autogeneration.dto;

import com.celeste.remedicard.io.common.enumeration.DataType;
import com.celeste.remedicard.io.common.enumeration.Language;
import com.celeste.remedicard.io.common.enumeration.TargetDataType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@Builder
@Data
public class DataProcessingTask implements Serializable {
    private Long id;
    private Long userId;
    private List<String> fileNames;
    private List<String> addresses;
    private Long mediaProcessingRecordId;
    private DataType dataType;
    private Language language;
    private TargetDataType targetDataType;
}