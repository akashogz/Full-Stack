import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import MatchBadge from '../components/MatchBadge';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}`);
        setJob(res.data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  useEffect(() => {
    if (!user || user.role !== 'JOBSEEKER') return;
    const checkApplied = async () => {
      try {
        const res = await api.get('/api/applications/my-applications');
        setApplied(res.data.some((a) => a.jobId === id));
      } catch {}
    };
    checkApplied();
  }, [id, user]);

  const handleApply = async () => {
    setApplying(true);
    setError('');
    try {
      await api.post('/api/applications/apply', { jobId: id, coverLetter });
      setApplied(true);
      setSuccess('Application submitted successfully!');
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>;
  if (!job) return null;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 860 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
          ← Back
        </button>

        <div className="card card-elevated">
          <div className="job-detail-header">
            <div>
              <h1 className="job-detail-title">{job.title}</h1>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <span>🏢 {job.company || job.recruiterName}</span>
                <span>📍 {job.location}</span>
                {job.salary && <span>💰 {job.salary}</span>}
                <span>📅 Posted {formatDate(job.createdAt)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
              {user?.role === 'JOBSEEKER' && job.matchPercentage > 0 && (
                <MatchBadge percentage={job.matchPercentage} />
              )}

              {!user && (
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                  Login to Apply
                </button>
              )}
              {user?.role === 'JOBSEEKER' && (
                applied ? (
                  <span className="status-badge status-ACCEPTED">✓ Applied</span>
                ) : (
                  <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
                    Apply Now
                  </button>
                )
              )}
            </div>
          </div>

          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          {/* Match Progress */}
          {user?.role === 'JOBSEEKER' && job.matchPercentage > 0 && (
            <div className="card" style={{ marginBottom: 24, background: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Skill Match</span>
                <span style={{ fontSize: '0.85rem', fontFamily: 'var(--mono)', color: 'var(--accent-light)' }}>
                  {job.matchPercentage}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${job.matchPercentage}%`,
                    background: job.matchPercentage >= 70 ? 'var(--green)' : job.matchPercentage >= 40 ? 'var(--yellow)' : 'var(--red)',
                  }}
                />
              </div>
            </div>
          )}

          <div className="job-detail-section">
            <h3>Job Description</h3>
            <p className="job-detail-desc">{job.description}</p>
          </div>

          {job.skillsRequired?.length > 0 && (
            <div className="job-detail-section">
              <h3>Skills Required</h3>
              <div className="tags-list">
                {job.skillsRequired.map((skill) => {
                  const userHas = user?.skills?.some((s) => s.toLowerCase() === skill.toLowerCase());
                  return (
                    <span key={skill} className={`tag ${userHas ? 'tag-green' : ''}`}>
                      {userHas ? '✓ ' : ''}{skill}
                    </span>
                  );
                })}
              </div>
              {user?.role === 'JOBSEEKER' && user.skills?.length > 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 10 }}>
                  ✓ Green = skills you have
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Apply for: {job.title}</h2>

            {!user?.resumePath && (
              <div className="alert alert-error" style={{ marginBottom: 16 }}>
                ⚠️ No resume found. Upload one from your Dashboard first.
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Cover Letter <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
              <textarea
                className="form-textarea"
                placeholder="Tell the recruiter why you're a great fit..."
                rows={5}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleApply} disabled={applying || !user?.resumePath}>
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
