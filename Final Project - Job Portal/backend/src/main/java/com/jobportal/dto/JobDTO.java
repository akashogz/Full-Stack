package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.time.LocalDateTime;

public class JobDTO {

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class JobRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Description is required")
        private String description;

        private List<String> skillsRequired;

        private String salary;

        @NotBlank(message = "Location is required")
        private String location;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class JobResponse {
        private String id;
        private String title;
        private String description;
        private List<String> skillsRequired;
        private String salary;
        private String location;
        private String recruiterId;
        private String recruiterName;
        private String company;
        private boolean active;
        private LocalDateTime createdAt;
        private int matchPercentage; // computed for job seekers
    }
}
