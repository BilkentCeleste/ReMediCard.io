package com.celeste.remedicard.io.autogeneration.controller;

import com.celeste.remedicard.io.autogeneration.config.DataType;
import com.celeste.remedicard.io.autogeneration.config.Language;
import com.celeste.remedicard.io.autogeneration.config.TargetDataType;
import com.celeste.remedicard.io.autogeneration.service.MediaProcessingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("auto_generation")
@Controller
public class AutoGenerationController {

    private final MediaProcessingService mediaProcessingService;

    @PostMapping(path= "deck/generate", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_OCTET_STREAM_VALUE})
    public ResponseEntity<Void> generateDeckFromLectureMaterial(
            @RequestPart("files") MultipartFile[] files,
            @RequestPart("dataType") String dataType,
            @RequestPart("language") String language) throws IOException {

        List<InputStream> inputStreams = new ArrayList<>();
        List<String> fileNames = new ArrayList<>();
        List<Long> fileSizes = new ArrayList<>();
        for (MultipartFile file : files) {
            inputStreams.add(file.getInputStream());
            fileNames.add(file.getOriginalFilename());
            fileSizes.add(file.getSize());
        }

        mediaProcessingService.enqueueAutoGenerationTask(inputStreams,
                fileNames,
                fileSizes,
                DataType.valueOf(dataType),
                Language.valueOf(language),
                TargetDataType.DECK);

        return ResponseEntity.ok().build();
    }

    @PostMapping(path= "quiz/generate", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_OCTET_STREAM_VALUE})
    public ResponseEntity<Void> generateQuizFromLectureMaterial(
            @RequestPart("files") MultipartFile[] files,
            @RequestPart("dataType") String dataType,
            @RequestPart("language") String language) throws IOException {

        List<InputStream> inputStreams = new ArrayList<>();
        List<String> fileNames = new ArrayList<>();
        List<Long> fileSizes = new ArrayList<>();
        for (MultipartFile file : files) {
            inputStreams.add(file.getInputStream());
            fileNames.add(file.getOriginalFilename());
            fileSizes.add(file.getSize());
        }

        mediaProcessingService.enqueueAutoGenerationTask(inputStreams,
                fileNames,
                fileSizes,
                DataType.valueOf(dataType),
                Language.valueOf(language),
                TargetDataType.QUIZ);

        return ResponseEntity.ok().build();
    }


}
