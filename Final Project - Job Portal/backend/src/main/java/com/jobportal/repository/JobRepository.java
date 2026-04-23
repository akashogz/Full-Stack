package com.jobportal.repository;

import com.jobportal.model.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findByRecruiterId(String recruiterId);
    List<Job> findByActiveTrue();
    
    @Query("{ 'title': { $regex: ?0, $options: 'i' }, 'active': true }")
    List<Job> findByTitleContainingIgnoreCaseAndActiveTrue(String title);
    
    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'location': { $regex: ?0, $options: 'i' } } ], 'active': true }")
    List<Job> searchJobs(String keyword);
}
