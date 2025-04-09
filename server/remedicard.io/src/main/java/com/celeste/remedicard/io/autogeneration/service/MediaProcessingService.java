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

@AllArgsConstructor
@Service
public class MediaProcessingService {

    private final QueueService queueService;
    private final S3Service s3Service;
    private final MediaProcessingRecordRepository mediaProcessingRecordRepository;

    public void enqueueAutoGenerationTask
            (MultipartFile file, DataType dataType, Language language, TargetDataType targetDataType) throws IOException {

        String address = s3Service.uploadFile(file);

        MediaProcessingRecord mediaProcessingRecord = MediaProcessingRecord.builder()
                .address(address)
                .fileName(file.getOriginalFilename())
                .dataType(dataType)
                .language(language)
                .build();

        mediaProcessingRecordRepository.save(mediaProcessingRecord);

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        DataProcessingTask dataProcessingTask = DataProcessingTask.builder()
                .id(mediaProcessingRecord.getId())
                .address(address)
                .dataType(dataType)
                .userId(user.getId())
                .language(language)
                .targetDataType(targetDataType)
                .fileName(file.getOriginalFilename())
                .build();

        if(dataType.equals(DataType.VIDEO_RECORD)){
            queueService.enqueueVideoRecord(dataProcessingTask);
            return;
        }

        if(dataType.equals(DataType.VOICE_RECORD)){
            queueService.enqueueVoiceRecord(dataProcessingTask);
            return;
        }

        //TODO OTHER DATA TYPES
        throw new IllegalArgumentException();
    }

}
