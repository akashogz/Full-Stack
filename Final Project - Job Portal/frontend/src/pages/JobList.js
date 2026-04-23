import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const { user } = useAuth();

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const url = search
        ? `/api/jobs/search?keyword=${encodeURIComponent(search)}`
        : '/api/jobs/all';
      const res = await api.get(url);
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const clearSearch = () => {
    setSearch('');
    setSearchInput('');
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(108,99,255,0.12) 0%, transparent 60%)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '48px 40px',
          marginBottom: 40,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(108,99,255,0.2), transparent)',
            borderRadius: '50%'
          }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 10 }}>
            Find Your Next <span style={{ color: 'var(--accent-light)' }}>Dream Job</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 28 }}>
            {user?.role === 'JOBSEEKER'
              ? `Welcome back, ${user.name}! Jobs matched to your skills are highlighted.`
              : 'Browse all active job listings below.'}
          </p>

          {/* Search */}
          <form onSubmit={handleSearch}>
            <div className="search-bar">
              <div className="search-input-wrap">
                <span className="search-icon">🔍</span>
                <input
                  className="search-input"
                  placeholder="Search by title, location..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" type="submit">Search</button>
              {search && (
                <button className="btn btn-ghost" type="button" onClick={clearSearch}>Clear</button>
              )}
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {loading ? 'Loading...' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} found`}
            </span>
            {search && (
              <span style={{ color: 'var(--accent-light)', marginLeft: 8, fontSize: '0.9rem' }}>
                for "{search}"
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No jobs found</h3>
            <p style={{ marginBottom: 20 }}>
              {search ? `No results for "${search}"` : 'No jobs posted yet. Check back soon!'}
            </p>
            {search && <button className="btn btn-outline" onClick={clearSearch}>Clear Search</button>}
          </div>
        ) : (
          <div className="job-grid">
            {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
