package com.celeste.remedicard.io.spacedrepetition.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import me.aldebrn.ebisu.EbisuModel;

public class EbisuUtils {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final int DEFAULT_ALPHA = 3;
    private static final int DEFAULT_BETA = 3;
    private static final int DEFAULT_TIME = 15; // in minutes

    static {
        objectMapper.addMixIn(EbisuModel.class, EbisuModelMixin.class);
    }

    public static String defaultEbisuModel() {
        return toJson(new EbisuModel(DEFAULT_TIME, DEFAULT_ALPHA, DEFAULT_BETA ));
    }

    public static String toJson(EbisuModel model) {
        try {
            return objectMapper.writeValueAsString(model);
        } catch (Exception e) {
            throw new RuntimeException("Error converting ebisu model to JSON", e);
        }
    }

    public static EbisuModel fromJson(String json) {
        try {
            return objectMapper.readValue(json, EbisuModel.class);
        } catch (Exception e) {
            throw new RuntimeException("Error converting JSON to ebisu model", e);
        }
    }
}
