package com.celeste.remedicard.io.autogeneration.dto;

import com.celeste.remedicard.io.autogeneration.config.DataType;
import com.celeste.remedicard.io.autogeneration.config.Language;
import lombok.Data;

@Data
public class AutoGenerationRequest {

    private DataType dataType;
    private Language language;
}
