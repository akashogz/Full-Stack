package com.jobportal.service;

import com.jobportal.dto.ApplicationDTO;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.exception.UnauthorizedException;
import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private JobRepository jobRepository;
    @Autowired private UserRepository userRepository;

    public ApplicationDTO.ApplicationResponse applyForJob(
            ApplicationDTO.ApplicationRequest request, String seekerEmail) {

        User seeker = userRepository.findByEmail(seekerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!"JOBSEEKER".equals(seeker.getRole())) {
            throw new UnauthorizedException("Only job seekers can apply for jobs");
        }

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + request.getJobId()));

        if (applicationRepository.existsByJobIdAndJobSeekerId(request.getJobId(), seeker.getId())) {
            throw new BadRequestException("You have already applied for this job");
        }

        int matchPct = computeMatch(job.getSkillsRequired(), seeker.getSkills());

        Application app = new Application();
        app.setJobId(job.getId());
        app.setJobTitle(job.getTitle());
        app.setJobSeekerId(seeker.getId());
        app.setJobSeekerName(seeker.getName());
        app.setJobSeekerEmail(seeker.getEmail());
        app.setResumePath(seeker.getResumePath());
        app.setCoverLetter(request.getCoverLetter());
        app.setStatus("PENDING");
        app.setMatchPercentage(matchPct);

        app = applicationRepository.save(app);
        return toResponse(app);
    }

    public List<ApplicationDTO.ApplicationResponse> getApplicationsForSeeker(String seekerEmail) {
        User seeker = userRepository.findByEmail(seekerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return applicationRepository.findByJobSeekerId(seeker.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ApplicationDTO.ApplicationResponse> getApplicationsForJob(String jobId, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));

        if (!job.getRecruiterId().equals(recruiter.getId())) {
            throw new UnauthorizedException("You can only view applicants for your own jobs");
        }

        return applicationRepository.findByJobId(jobId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ApplicationDTO.ApplicationResponse updateStatus(
            String appId, ApplicationDTO.StatusUpdateRequest request, String recruiterEmail) {

        Application app = applicationRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        Job job = jobRepository.findById(app.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        if (!job.getRecruiterId().equals(recruiter.getId())) {
            throw new UnauthorizedException("Not authorized to update this application");
        }

        app.setStatus(request.getStatus());
        app = applicationRepository.save(app);
        return toResponse(app);
    }

    private int computeMatch(List<String> jobSkills, List<String> userSkills) {
        if (jobSkills == null || jobSkills.isEmpty() || userSkills == null || userSkills.isEmpty()) return 0;
        long matched = jobSkills.stream()
                .filter(s -> userSkills.stream().anyMatch(us -> us.equalsIgnoreCase(s)))
                .count();
        return (int) Math.round((matched * 100.0) / jobSkills.size());
    }

    private ApplicationDTO.ApplicationResponse toResponse(Application app) {
        ApplicationDTO.ApplicationResponse r = new ApplicationDTO.ApplicationResponse();
        r.setId(app.getId());
        r.setJobId(app.getJobId());
        r.setJobTitle(app.getJobTitle());
        r.setJobSeekerId(app.getJobSeekerId());
        r.setJobSeekerName(app.getJobSeekerName());
        r.setJobSeekerEmail(app.getJobSeekerEmail());
        r.setResumePath(app.getResumePath());
        r.setCoverLetter(app.getCoverLetter());
        r.setStatus(app.getStatus());
        r.setMatchPercentage(app.getMatchPercentage());
        r.setAppliedAt(app.getAppliedAt());
        return r;
    }
}
