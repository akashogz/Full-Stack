import React from 'react';
import { useNavigate } from 'react-router-dom';
import MatchBadge from './MatchBadge';
import { useAuth } from '../context/AuthContext';

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
      <div className="job-card-header">
        <div>
          <div className="job-card-title">{job.title}</div>
          <div className="job-card-company">{job.company || job.recruiterName}</div>
        </div>
        {user?.role === 'JOBSEEKER' && job.matchPercentage > 0 && (
          <MatchBadge percentage={job.matchPercentage} />
        )}
      </div>

      <div className="job-card-meta">
        <span>📍 {job.location}</span>
        {job.salary && <span>💰 {job.salary}</span>}
        <span>📅 {formatDate(job.createdAt)}</span>
      </div>

      <p className="job-card-desc">{job.description}</p>

      {job.skillsRequired?.length > 0 && (
        <div className="tags-list">
          {job.skillsRequired.slice(0, 4).map((skill) => (
            <span key={skill} className="tag">{skill}</span>
          ))}
          {job.skillsRequired.length > 4 && (
            <span className="tag" style={{ background: 'transparent', border: '1px solid var(--border)' }}>
              +{job.skillsRequired.length - 4}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;
