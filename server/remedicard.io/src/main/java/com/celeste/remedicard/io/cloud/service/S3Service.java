package com.celeste.remedicard.io.cloud.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class S3Service {

    private final S3Client s3Client;
    private final CurrentUserService currentUserService;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.region}")
    private String region;

    public List<String> uploadFiles(MultipartFile[] files) throws IOException {
        User user = currentUserService.getCurrentUser();

        List<String> addresses = new ArrayList<>();

        String fileName, key, fileAddress, folderName;

        folderName = user.getId() + "/task_" + UUID.randomUUID();

        for(MultipartFile file : files) {
            fileName = file.getOriginalFilename();

            key = "media_processing_files" + "/" + folderName + "/" +  fileName;

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            fileAddress = "https://" + bucketName + ".s3." + region + ".amazonaws.com/"+ key;

            addresses.add(fileAddress);
        }

        return addresses;
    }
}
