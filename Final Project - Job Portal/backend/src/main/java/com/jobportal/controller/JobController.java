package com.jobportal.controller;

import com.jobportal.dto.JobDTO;
import com.jobportal.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    // Public endpoints
    @GetMapping("/all")
    public ResponseEntity<List<JobDTO.JobResponse>> getAllJobs(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(jobService.getAllJobs(email));
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobDTO.JobResponse>> searchJobs(
            @RequestParam String keyword,
            Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(jobService.searchJobs(keyword, email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDTO.JobResponse> getJobById(
            @PathVariable String id,
            Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(jobService.getJobById(id, email));
    }

    // Protected - Recruiter only
    @PostMapping
    public ResponseEntity<JobDTO.JobResponse> createJob(
            @Valid @RequestBody JobDTO.JobRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(jobService.createJob(request, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobDTO.JobResponse> updateJob(
            @PathVariable String id,
            @Valid @RequestBody JobDTO.JobRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(jobService.updateJob(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(
            @PathVariable String id,
            Authentication authentication) {
        jobService.deleteJob(id, authentication.getName());
        return ResponseEntity.ok("Job deleted successfully");
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<List<JobDTO.JobResponse>> getMyJobs(Authentication authentication) {
        return ResponseEntity.ok(jobService.getRecruiterJobs(authentication.getName()));
    }
}
