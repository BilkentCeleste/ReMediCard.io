package com.celeste.remedicard.io.spacedrepetition.utils;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public abstract class EbisuModelMixin {
    @JsonCreator
    public EbisuModelMixin(
            @JsonProperty("time") double time,
            @JsonProperty("alpha") double alpha,
            @JsonProperty("beta") double beta
    ) {}
}