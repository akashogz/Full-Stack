package com.jobportal.controller;

import com.jobportal.dto.ApplicationDTO;
import com.jobportal.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    // Job seeker applies for a job
    @PostMapping("/apply")
    public ResponseEntity<ApplicationDTO.ApplicationResponse> applyForJob(
            @RequestBody ApplicationDTO.ApplicationRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(applicationService.applyForJob(request, authentication.getName()));
    }

    // Job seeker views their own applications
    @GetMapping("/my-applications")
    public ResponseEntity<List<ApplicationDTO.ApplicationResponse>> getMyApplications(
            Authentication authentication) {
        return ResponseEntity.ok(applicationService.getApplicationsForSeeker(authentication.getName()));
    }

    // Recruiter views applicants for a specific job
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationDTO.ApplicationResponse>> getApplicationsForJob(
            @PathVariable String jobId,
            Authentication authentication) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId, authentication.getName()));
    }

    // Recruiter updates application status
    @PutMapping("/{appId}/status")
    public ResponseEntity<ApplicationDTO.ApplicationResponse> updateStatus(
            @PathVariable String appId,
            @RequestBody ApplicationDTO.StatusUpdateRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(applicationService.updateStatus(appId, request, authentication.getName()));
    }
}
