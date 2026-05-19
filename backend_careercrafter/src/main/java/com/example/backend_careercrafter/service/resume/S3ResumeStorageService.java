package com.example.backend_careercrafter.service.resume;


import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3ResumeStorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.s3.presign-duration-minutes:10}")
    private long presignDurationMinutes;

    public void upload(String objectKey, MultipartFile file) throws IOException {
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey) //path where resume stores in s3
                .contentType(file.getContentType())//file type like word,pdf,xlsx
                .build();

        s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        log.info("File uploaded to S3: bucket={}, object={}", bucketName, objectKey);
    }

    public String createPresignedUrl(String objectKeyOrUrl) {
        String objectKey = extractObjectKey(objectKeyOrUrl);
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(presignDurationMinutes))
                .getObjectRequest(getObjectRequest)
                .build();

        return s3Presigner.presignGetObject(presignRequest).url().toString();
    }

    public void delete(String objectKeyOrUrl) {
        String objectKey = extractObjectKey(objectKeyOrUrl);
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build());
        log.info("Successfully deleted object from S3: {}", objectKey);
    }

    public String extractObjectKey(String objectKeyOrUrl) {
        if (objectKeyOrUrl == null || objectKeyOrUrl.isBlank()) {
            throw new IllegalArgumentException("S3 object key is empty");
        }

        if (!objectKeyOrUrl.startsWith("http://") && !objectKeyOrUrl.startsWith("https://")) {
            return objectKeyOrUrl;
        }

        try {
            java.net.URL url = new java.net.URL(objectKeyOrUrl);
            String path = url.getPath();
            String withoutLeadingSlash = path.startsWith("/") ? path.substring(1) : path;
            String key = withoutLeadingSlash.startsWith(bucketName + "/")
                    ? withoutLeadingSlash.substring(bucketName.length() + 1)
                    : withoutLeadingSlash;
            return URLDecoder.decode(key, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Could not parse S3 object key from URL: " + objectKeyOrUrl, e);
        }
    }
}
