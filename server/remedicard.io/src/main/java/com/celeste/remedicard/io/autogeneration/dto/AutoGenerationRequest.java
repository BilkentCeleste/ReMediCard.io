package com.celeste.remedicard.io.autogeneration.dto;

import com.celeste.remedicard.io.common.enumeration.DataType;
import com.celeste.remedicard.io.common.enumeration.Language;
import lombok.Data;

@Data
public class AutoGenerationRequest {

    private DataType dataType;
    private Language language;
}
