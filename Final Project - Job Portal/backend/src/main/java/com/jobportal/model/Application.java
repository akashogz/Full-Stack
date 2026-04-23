package com.jobportal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "applications")
public class Application {

    @Id
    private String id;

    private String jobId;

    private String jobTitle;

    private String jobSeekerId;

    private String jobSeekerName;

    private String jobSeekerEmail;

    private String resumePath;

    private String coverLetter;

    private String status; // PENDING, REVIEWED, ACCEPTED, REJECTED

    private int matchPercentage;

    private LocalDateTime appliedAt = LocalDateTime.now();
}
