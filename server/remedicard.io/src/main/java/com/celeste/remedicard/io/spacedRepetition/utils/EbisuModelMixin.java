package com.celeste.remedicard.io.spacedRepetition.utils;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public abstract class EbisuModelMixin {
    @JsonCreator
    public EbisuModelMixin(
            @JsonProperty("alpha") double alpha,
            @JsonProperty("beta") double beta,
            @JsonProperty("time") double time
    ) {}
}