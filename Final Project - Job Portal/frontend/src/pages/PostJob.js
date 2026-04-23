import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const JobForm = ({ initial = {}, onSubmit, loading, title }) => {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    salary: initial.salary || '',
    location: initial.location || '',
    skillsRequired: initial.skillsRequired || [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const s = skillInput.trim();
      if (s && !form.skillsRequired.includes(s)) {
        setForm({ ...form, skillsRequired: [...form.skillsRequired, s] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) =>
    setForm({ ...form, skillsRequired: form.skillsRequired.filter((s) => s !== skill) });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description || !form.location) {
      setError('Title, Description, and Location are required.');
      return;
    }
    onSubmit(form, setError);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label className="form-label">Job Title *</label>
        <input className="form-input" name="title" placeholder="e.g. Senior React Developer"
          value={form.title} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label className="form-label">Description *</label>
        <textarea className="form-textarea" name="description"
          placeholder="Describe the role, responsibilities, and expectations..."
          style={{ minHeight: 160 }}
          value={form.description} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Location *</label>
          <input className="form-input" name="location" placeholder="e.g. Bangalore / Remote"
            value={form.location} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Salary / Package</label>
          <input className="form-input" name="salary" placeholder="e.g. ₹8–12 LPA"
            value={form.salary} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Skills Required{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(press Enter or comma to add)</span>
        </label>
        <input
          className="form-input"
          placeholder="e.g. React, Node.js, MongoDB..."
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={addSkill}
        />
        {form.skillsRequired.length > 0 && (
          <div className="tags-list" style={{ marginTop: 10 }}>
            {form.skillsRequired.map((s) => (
              <span key={s} className="tag" style={{ cursor: 'pointer' }} onClick={() => removeSkill(s)}>
                {s} ✕
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button type="button" className="btn btn-ghost" onClick={() => window.history.back()}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading ? 'Saving...' : title}
        </button>
      </div>
    </form>
  );
};

const PostJob = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (form, setError) => {
    setLoading(true);
    try {
      await api.post('/api/jobs', form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job.');
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 720 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
          ← Back
        </button>
        <div className="page-header">
          <h1 className="page-title">Post a New Job</h1>
          <p className="page-subtitle">Fill in the details to attract the right candidates.</p>
        </div>
        <div className="card card-elevated">
          <JobForm onSubmit={handleSubmit} loading={loading} title="Post Job" />
        </div>
      </div>
    </div>
  );
};

export default PostJob;
export { JobForm };
