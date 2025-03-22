package com.celeste.remedicard.io.autogeneration.service;


import com.celeste.remedicard.io.autogeneration.config.DataType;
import com.celeste.remedicard.io.autogeneration.config.Language;
import com.celeste.remedicard.io.autogeneration.dto.AutoGenerationRequest;
import com.celeste.remedicard.io.autogeneration.dto.DataProcessingTask;
import com.celeste.remedicard.io.autogeneration.entity.MediaProcessingRecord;
import com.celeste.remedicard.io.autogeneration.repository.MediaProcessingRecordRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@Service
public class MediaProcessingService {

    private final QueueService queueService;
    private final MediaProcessingRecordRepository mediaProcessingRecordRepository;

    public void enqueueAutoGenerationTask
            (MultipartFile file, DataType dataType, Language language) {

        //TODO Upload to S3 Bucket
        String address = "ADDRESS";

        MediaProcessingRecord mediaProcessingRecord = MediaProcessingRecord.builder()
                .address(address)
                .fileName(file.getOriginalFilename())
                .dataType(dataType)
                .language(language)
                .build();

        mediaProcessingRecordRepository.save(mediaProcessingRecord);

        DataProcessingTask dataProcessingTask = DataProcessingTask.builder()
                .id(mediaProcessingRecord.getId())
                .address(address)
                .dataType(dataType)
                .language(language)
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
