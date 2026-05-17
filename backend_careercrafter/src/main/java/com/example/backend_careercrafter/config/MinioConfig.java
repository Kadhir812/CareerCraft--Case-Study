// package com.example.backend_careercrafter.config;


// import io.minio.MinioClient;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// @Configuration
// public class MinioConfig {
//     @Value("${minio.url}")
//     private String minioUrl;
//     @Value("${minio.access-key}")
//     private String accessKey;
//     @Value("${minio.secret-key}")
//     private String secretKey;

//     @Value("${minio.bucket}")
//     private String bucketName;

//     @Bean
//     public MinioClient minioClient() {
//         MinioClient client = MinioClient.builder()
//                 .endpoint(minioUrl)
//                 .credentials(accessKey, secretKey)
//                 .build();
//         try {
//             boolean found = client.bucketExists(
//                     io.minio.BucketExistsArgs.builder().bucket(bucketName).build());
//             if (!found) {
//                 client.makeBucket(io.minio.MakeBucketArgs.builder().bucket(bucketName).build());
//             }
//         } catch (Exception e) {
//             throw new RuntimeException("Failed to ensure MinIO bucket exists", e);
//         }
//         return client;
//     }
// }