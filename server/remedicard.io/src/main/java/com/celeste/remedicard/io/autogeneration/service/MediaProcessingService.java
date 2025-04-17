package com.celeste.remedicard.io.autogeneration.service;


import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.autogeneration.config.DataType;
import com.celeste.remedicard.io.autogeneration.config.Language;
import com.celeste.remedicard.io.autogeneration.config.TargetDataType;
import com.celeste.remedicard.io.autogeneration.dto.AutoGenerationRequest;
import com.celeste.remedicard.io.autogeneration.dto.DataProcessingTask;
import com.celeste.remedicard.io.autogeneration.entity.MediaProcessingRecord;
import com.celeste.remedicard.io.autogeneration.repository.MediaProcessingRecordRepository;
import com.celeste.remedicard.io.cloud.service.S3Service;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class MediaProcessingService {

    private final QueueService queueService;
    private final S3Service s3Service;
    private final MediaProcessingRecordRepository mediaProcessingRecordRepository;

    public void enqueueAutoGenerationTask
            (MultipartFile[] files, DataType dataType, Language language, TargetDataType targetDataType) throws IOException {

        List<String> addresses = s3Service.uploadFiles(files);

        List<String> fileNames = Arrays.stream(files).map(MultipartFile::getOriginalFilename).toList();

        MediaProcessingRecord mediaProcessingRecord = MediaProcessingRecord.builder()
                .addresses(addresses)
                .fileNames(fileNames)
                .dataType(dataType)
                .language(language)
                .isProcessed(false)
                .isFilesCleaned(false)
                .build();

        mediaProcessingRecordRepository.save(mediaProcessingRecord);

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        DataProcessingTask dataProcessingTask = DataProcessingTask.builder()
                .id(mediaProcessingRecord.getId())
                .addresses(addresses)
                .dataType(dataType)
                .userId(user.getId())
                .mediaProcessingRecordId(mediaProcessingRecord.getId())
                .language(language)
                .targetDataType(targetDataType)
                .fileNames(fileNames)
                .build();

        if(dataType.equals(DataType.VIDEO_RECORD)){
            queueService.enqueueVideoRecord(dataProcessingTask);
            return;
        }

        if(dataType.equals(DataType.VOICE_RECORD)){
            queueService.enqueueVoiceRecord(dataProcessingTask);
            return;
        }

        if(dataType.equals(DataType.LECTURE_NOTES_IMAGES)){
            queueService.enqueueLectureNotesImages(dataProcessingTask);
            return;
        }

        if(dataType.equals(DataType.LECTURE_NOTES_PDF)){
            queueService.enqueueLectureNotesPdf(dataProcessingTask);
            return;
        }

        throw new IllegalArgumentException();
    }

}
