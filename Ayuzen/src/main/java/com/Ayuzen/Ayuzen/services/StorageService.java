package com.Ayuzen.Ayuzen.services;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class StorageService {

    // Helper to get the public URL
    private static final String DOWNLOAD_URL_FORMAT = "https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media";

    public String uploadFile(MultipartFile file, String userEmail) throws IOException {
        Bucket bucket = StorageClient.getInstance().bucket();

        // Create a unique file name
        String fileName = userEmail + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

        // Upload the file
        Blob blob = bucket.create(fileName, file.getBytes(), file.getContentType());

        // Return the public, permanent URL
        return String.format(DOWNLOAD_URL_FORMAT, bucket.getName(), URLEncoder.encode(fileName, StandardCharsets.UTF_8));
    }
}