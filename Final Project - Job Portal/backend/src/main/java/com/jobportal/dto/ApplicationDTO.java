package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

public class ApplicationDTO {

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ApplicationRequest {
        private String jobId;
        private String coverLetter;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ApplicationResponse {
        private String id;
        private String jobId;
        private String jobTitle;
        private String jobSeekerId;
        private String jobSeekerName;
        private String jobSeekerEmail;
        private String resumePath;
        private String coverLetter;
        private String status;
        private int matchPercentage;
        private LocalDateTime appliedAt;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class StatusUpdateRequest {
        private String status;
    }
}
