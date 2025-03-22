package com.celeste.remedicard.io.autogeneration.controller;

import com.celeste.remedicard.io.autogeneration.config.DataType;
import com.celeste.remedicard.io.autogeneration.config.Language;
import com.celeste.remedicard.io.autogeneration.service.MediaProcessingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("auto_generation")
@Controller
public class AutoGenerationController {

    private final MediaProcessingService mediaProcessingService;

    @PostMapping(path= "generate", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_OCTET_STREAM_VALUE})
    public ResponseEntity<Void> generateDeckFromLectureMaterial(
            @RequestPart("file") MultipartFile file,
            @RequestPart("dataType") String dataType,
            @RequestPart("language") String language) {

        mediaProcessingService.enqueueAutoGenerationTask(file,
                DataType.valueOf(dataType),
                Language.valueOf(language));

        return ResponseEntity.ok().build();
    }


}
