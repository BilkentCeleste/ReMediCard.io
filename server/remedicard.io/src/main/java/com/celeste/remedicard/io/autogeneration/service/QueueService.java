package com.celeste.remedicard.io.autogeneration.service;

import com.celeste.remedicard.io.autogeneration.config.DataType;
import com.celeste.remedicard.io.autogeneration.dto.DataProcessingTask;
import jakarta.annotation.Resource;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class QueueService {

    private static final String VIDEO_RECORD_QUEUE_NAME = "video-queue";
    private static final String VOICE_RECORD_QUEUE_NAME = "voice-queue";

    @Resource(name = "redisTemplate")
    private ListOperations<String, DataProcessingTask> listOperations;

    public void enqueueVideoRecord(DataProcessingTask dataProcessingTask) {
        listOperations.leftPush(VIDEO_RECORD_QUEUE_NAME, dataProcessingTask);
    }

    public void enqueueVoiceRecord(DataProcessingTask dataProcessingTask) {
        listOperations.leftPush(VOICE_RECORD_QUEUE_NAME, dataProcessingTask);
    }

    public DataProcessingTask dequeueVideoRecord() {
        return listOperations.rightPop(VIDEO_RECORD_QUEUE_NAME, 0, TimeUnit.SECONDS);
    }

    public DataProcessingTask dequeueVoiceRecord() {
        return listOperations.rightPop(VOICE_RECORD_QUEUE_NAME, 0, TimeUnit.SECONDS);
    }

    public DataProcessingTask dequeueVideoRecordNonBlocking() {
        return listOperations.rightPop(VIDEO_RECORD_QUEUE_NAME);
    }

    public DataProcessingTask dequeueVoiceRecordNonBlocking() {
        return listOperations.rightPop(VOICE_RECORD_QUEUE_NAME);
    }

    public Long getQueueSize(DataType dataType) {

        if(dataType.equals(DataType.VIDEO_RECORD)) {
            return listOperations.size(VIDEO_RECORD_QUEUE_NAME);
        }

        if(dataType.equals(DataType.VIDEO_RECORD)) {
            return listOperations.size(VIDEO_RECORD_QUEUE_NAME);
        }

        //TODO OTHER DATA TYPES
        throw new RuntimeException("Unsupported data type: " + dataType);
    }
}
