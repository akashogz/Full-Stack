package com.jobportal.service;

import com.jobportal.dto.JobDTO;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.exception.UnauthorizedException;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired private JobRepository jobRepository;
    @Autowired private UserRepository userRepository;

    public JobDTO.JobResponse createJob(JobDTO.JobRequest request, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        if (!"RECRUITER".equals(recruiter.getRole())) {
            throw new UnauthorizedException("Only recruiters can post jobs");
        }

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setSkillsRequired(request.getSkillsRequired());
        job.setSalary(request.getSalary());
        job.setLocation(request.getLocation());
        job.setRecruiterId(recruiter.getId());
        job.setRecruiterName(recruiter.getName());
        job.setCompany(recruiter.getCompany());

        job = jobRepository.save(job);
        return toResponse(job, Collections.emptyList());
    }

    public JobDTO.JobResponse updateJob(String jobId, JobDTO.JobRequest request, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));

        if (!job.getRecruiterId().equals(recruiter.getId())) {
            throw new UnauthorizedException("You can only update your own jobs");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setSkillsRequired(request.getSkillsRequired());
        job.setSalary(request.getSalary());
        job.setLocation(request.getLocation());
        job.setUpdatedAt(LocalDateTime.now());

        job = jobRepository.save(job);
        return toResponse(job, Collections.emptyList());
    }

    public void deleteJob(String jobId, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));

        if (!job.getRecruiterId().equals(recruiter.getId())) {
            throw new UnauthorizedException("You can only delete your own jobs");
        }

        jobRepository.delete(job);
    }

    public List<JobDTO.JobResponse> getAllJobs(String userEmail) {
        List<String> userSkills = getUserSkills(userEmail);
        return jobRepository.findByActiveTrue().stream()
                .map(job -> toResponse(job, userSkills))
                .collect(Collectors.toList());
    }

    public List<JobDTO.JobResponse> searchJobs(String keyword, String userEmail) {
        List<String> userSkills = getUserSkills(userEmail);
        return jobRepository.searchJobs(keyword).stream()
                .map(job -> toResponse(job, userSkills))
                .collect(Collectors.toList());
    }

    public JobDTO.JobResponse getJobById(String jobId, String userEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));
        List<String> userSkills = getUserSkills(userEmail);
        return toResponse(job, userSkills);
    }

    public List<JobDTO.JobResponse> getRecruiterJobs(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));
        return jobRepository.findByRecruiterId(recruiter.getId()).stream()
                .map(job -> toResponse(job, Collections.emptyList()))
                .collect(Collectors.toList());
    }

    private List<String> getUserSkills(String userEmail) {
        if (userEmail == null) return Collections.emptyList();
        return userRepository.findByEmail(userEmail)
                .map(u -> u.getSkills() != null ? u.getSkills() : Collections.<String>emptyList())
                .orElse(Collections.emptyList());
    }

    private int computeMatchPercentage(List<String> jobSkills, List<String> userSkills) {
        if (jobSkills == null || jobSkills.isEmpty() || userSkills == null || userSkills.isEmpty()) return 0;
        long matched = jobSkills.stream()
                .filter(skill -> userSkills.stream()
                        .anyMatch(us -> us.equalsIgnoreCase(skill)))
                .count();
        return (int) Math.round((matched * 100.0) / jobSkills.size());
    }

    public JobDTO.JobResponse toResponse(Job job, List<String> userSkills) {
        JobDTO.JobResponse response = new JobDTO.JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setSkillsRequired(job.getSkillsRequired());
        response.setSalary(job.getSalary());
        response.setLocation(job.getLocation());
        response.setRecruiterId(job.getRecruiterId());
        response.setRecruiterName(job.getRecruiterName());
        response.setCompany(job.getCompany());
        response.setActive(job.isActive());
        response.setCreatedAt(job.getCreatedAt());
        response.setMatchPercentage(computeMatchPercentage(job.getSkillsRequired(), userSkills));
        return response;
    }
}
