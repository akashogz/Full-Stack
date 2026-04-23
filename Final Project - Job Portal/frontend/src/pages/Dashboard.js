import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ResumeUpload from '../components/ResumeUpload';

/* ─── Job Seeker Dashboard ─── */
const SeekerDashboard = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/api/applications/my-applications');
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const statusCount = (status) => applications.filter((a) => a.status === status).length;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">👋 Hello, {user.name}</h1>
          <p className="page-subtitle">Job Seeker Dashboard</p>
        </div>

        {/* Stats */}
        <div className="stat-grid">
          {[
            { label: 'Total Applied', value: applications.length, icon: '📋' },
            { label: 'Pending', value: statusCount('PENDING'), icon: '⏳' },
            { label: 'Reviewed', value: statusCount('REVIEWED'), icon: '👁️' },
            { label: 'Accepted', value: statusCount('ACCEPTED'), icon: '✅' },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{s.icon}</div>
              <div className="stat-card-value">{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['applications', 'resume', 'profile'].map((tab) => (
            <button
              key={tab}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'} btn-sm`}
              onClick={() => setActiveTab(tab)}
              style={{ textTransform: 'capitalize' }}
            >
              {tab === 'applications' ? '📋 Applications' : tab === 'resume' ? '📄 Resume' : '👤 Profile'}
            </button>
          ))}
        </div>

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="card">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20 }}>My Applications</h2>
            {loading ? (
              <div className="loading-wrap"><div className="spinner" /></div>
            ) : applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>No applications yet</h3>
                <p style={{ marginBottom: 20, color: 'var(--text-muted)' }}>Start applying to jobs!</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Browse Jobs</button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Applied On</th>
                      <th>Match</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <span
                            style={{ color: 'var(--accent-light)', cursor: 'pointer' }}
                            onClick={() => navigate(`/jobs/${app.jobId}`)}
                          >
                            {app.jobTitle}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          {new Date(app.appliedAt).toLocaleDateString('en-IN')}
                        </td>
                        <td>
                          <span style={{
                            fontFamily: 'var(--mono)', fontSize: '0.85rem',
                            color: app.matchPercentage >= 70 ? 'var(--green)' : app.matchPercentage >= 40 ? 'var(--yellow)' : 'var(--text-muted)'
                          }}>
                            {app.matchPercentage}%
                          </span>
                        </td>
                        <td><span className={`status-badge status-${app.status}`}>{app.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Resume Tab */}
        {activeTab === 'resume' && (
          <div className="card">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>📄 Resume</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 20 }}>
              Upload your resume to apply for jobs. Only PDF files accepted.
            </p>
            {user.resumePath && (
              <div className="alert alert-success" style={{ marginBottom: 16 }}>
                ✅ Resume on file: <span style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem' }}>{user.resumePath.split('/').pop()}</span>
              </div>
            )}
            <ResumeUpload />
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20 }}>👤 Profile Info</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              {[['Name', user.name], ['Email', user.email], ['Role', user.role]].map(([k, v]) => (
                <div key={k}>
                  <div className="form-label">{k}</div>
                  <div style={{ color: 'var(--text-primary)' }}>{v}</div>
                </div>
              ))}
              {user.skills?.length > 0 && (
                <div>
                  <div className="form-label">Skills</div>
                  <div className="tags-list" style={{ marginTop: 6 }}>
                    {user.skills.map((s) => <span key={s} className="tag">{s}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Recruiter Dashboard ─── */
const RecruiterDashboard = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/api/jobs/my-jobs');
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  const fetchApplicants = async (job) => {
    setSelectedJob(job);
    setActiveTab('applicants');
    setLoadingApps(true);
    try {
      const res = await api.get(`/api/applications/job/${job.id}`);
      setApplicants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApps(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/api/applications/${appId}/status`, { status });
      setApplicants((prev) => prev.map((a) => a.id === appId ? { ...a, status } : a));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Delete this job? This cannot be undone.')) return;
    try {
      await api.delete(`/api/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch {
      alert('Failed to delete job');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1 className="page-title">👔 Hello, {user.name}</h1>
            <p className="page-subtitle">{user.company || 'Recruiter'} · Dashboard</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/post-job')}>
            ➕ Post New Job
          </button>
        </div>

        {/* Stats */}
        <div className="stat-grid">
          {[
            { label: 'Jobs Posted', value: jobs.length, icon: '💼' },
            { label: 'Active Jobs', value: jobs.filter((j) => j.active).length, icon: '🟢' },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{s.icon}</div>
              <div className="stat-card-value">{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <button className={`btn ${activeTab === 'jobs' ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setActiveTab('jobs')}>
            💼 My Jobs
          </button>
          {selectedJob && (
            <button className={`btn ${activeTab === 'applicants' ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setActiveTab('applicants')}>
              👥 Applicants — {selectedJob.title}
            </button>
          )}
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="card">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20 }}>My Job Postings</h2>
            {loadingJobs ? (
              <div className="loading-wrap"><div className="spinner" /></div>
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>No jobs posted yet</h3>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/post-job')}>
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Location</th>
                      <th>Posted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id}>
                        <td style={{ fontWeight: 500 }}>{job.title}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{job.location}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          {new Date(job.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => fetchApplicants(job)}>
                              👥 Applicants
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={() => navigate(`/edit-job/${job.id}`)}>
                              ✏️ Edit
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteJob(job.id)}>
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Applicants Tab */}
        {activeTab === 'applicants' && selectedJob && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>
                Applicants for: <span style={{ color: 'var(--accent-light)' }}>{selectedJob.title}</span>
              </h2>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{applicants.length} total</span>
            </div>
            {loadingApps ? (
              <div className="loading-wrap"><div className="spinner" /></div>
            ) : applicants.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>No applications yet</h3>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Email</th>
                      <th>Match</th>
                      <th>Applied On</th>
                      <th>Resume</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((app) => (
                      <tr key={app.id}>
                        <td style={{ fontWeight: 500 }}>{app.jobSeekerName}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{app.jobSeekerEmail}</td>
                        <td>
                          <span style={{
                            fontFamily: 'var(--mono)', fontSize: '0.85rem',
                            color: app.matchPercentage >= 70 ? 'var(--green)' : app.matchPercentage >= 40 ? 'var(--yellow)' : 'var(--text-muted)'
                          }}>
                            {app.matchPercentage}%
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          {new Date(app.appliedAt).toLocaleDateString('en-IN')}
                        </td>
                        <td>
                          {app.resumePath ? (
                            <a
                              href={`http://localhost:8080/${app.resumePath}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-ghost btn-sm"
                            >
                              📄 View
                            </a>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>None</span>
                          )}
                        </td>
                        <td>
                          <select
                            value={app.status}
                            onChange={(e) => updateStatus(app.id, e.target.value)}
                            style={{
                              background: 'var(--bg)',
                              border: '1px solid var(--border)',
                              borderRadius: 6,
                              color: 'var(--text-primary)',
                              padding: '4px 8px',
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                            }}
                          >
                            {['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Main Dashboard (router) ─── */
const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === 'RECRUITER'
    ? <RecruiterDashboard user={user} />
    : <SeekerDashboard user={user} />;
};

export default Dashboard;
