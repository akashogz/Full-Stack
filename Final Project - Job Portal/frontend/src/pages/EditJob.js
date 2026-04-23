import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { JobForm } from './PostJob';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}`);
        setJob(res.data);
      } catch {
        navigate('/dashboard');
      } finally {
        setFetching(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleSubmit = async (form, setError) => {
    setLoading(true);
    try {
      await api.put(`/api/jobs/${id}`, form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job.');
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading-wrap"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 720 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
          ← Back
        </button>
        <div className="page-header">
          <h1 className="page-title">Edit Job</h1>
          <p className="page-subtitle">Update the details of your job posting.</p>
        </div>
        <div className="card card-elevated">
          {job && <JobForm initial={job} onSubmit={handleSubmit} loading={loading} title="Save Changes" />}
        </div>
      </div>
    </div>
  );
};

export default EditJob;
