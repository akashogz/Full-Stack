package com.jobportal.repository;

import com.jobportal.model.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, String> {
    List<Application> findByJobSeekerId(String jobSeekerId);
    List<Application> findByJobId(String jobId);
    Optional<Application> findByJobIdAndJobSeekerId(String jobId, String jobSeekerId);
    boolean existsByJobIdAndJobSeekerId(String jobId, String jobSeekerId);
}
