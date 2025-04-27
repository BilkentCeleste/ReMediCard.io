package com.celeste.remedicard.io.flashcard.service;

import com.celeste.remedicard.io.cloud.service.S3Service;
import com.celeste.remedicard.io.flashcard.entity.Side;
import com.celeste.remedicard.io.flashcard.repository.SideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class SideService {

    private final S3Service s3Service;
    private final SideRepository sideRepository;

    @Async
    public void uploadImage(Side side, InputStream inputStream, long size, String fileName) throws IOException {
        if(side.getImageURL() != null) {
            s3Service.deleteFile(side.getImageURL());
        }

        String imageURL = s3Service.uploadFile(inputStream, size, fileName, "side-images");
        side.setImageURL(imageURL);
        sideRepository.save(side);
    }

    public void copySideImage(Side side){
        if(side.getImageURL() != null) {
            String newImageURL = s3Service.copyS3Object(side.getImageURL(), "side-images");
            side.setImageURL(newImageURL);
            sideRepository.save(side);
        }
    }
}
