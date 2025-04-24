package com.celeste.remedicard.io.cloud.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CopyObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
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

    public String uploadFile(MultipartFile file, String keyPrefix) throws IOException {
        User user = currentUserService.getCurrentUser();

        String fileName = file.getOriginalFilename();
        String key = keyPrefix + "/" + user.getId() + "/task_" + UUID.randomUUID() + "/" + fileName;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/"+ key;
    }

    public void deleteFile(String filePath) {
        String key = filePath.substring(filePath.indexOf(".com/") + 5);
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build());
    }

    public String copyS3Object(String sourceUrl, String keyPrefix) {
        User user = currentUserService.getCurrentUser();

        String sourceKey = sourceUrl.substring(sourceUrl.indexOf(".com/") + 5);

        String fileName = sourceKey.substring(sourceKey.lastIndexOf("/") + 1);
        String destinationKey = keyPrefix + "/" + user.getId() + "/task_" + UUID.randomUUID() + "/" + fileName;

        CopyObjectRequest copyRequest = CopyObjectRequest.builder()
                .sourceBucket(bucketName)
                .sourceKey(sourceKey)
                .destinationBucket(bucketName)
                .destinationKey(destinationKey)
                .build();

        s3Client.copyObject(copyRequest);

        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + destinationKey;
    }
}
