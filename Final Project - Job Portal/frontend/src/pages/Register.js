import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Register = () => {
  const [role, setRole] = useState('JOBSEEKER');
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', company: '', skills: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const s = skillInput.trim();
      if (s && !form.skills.includes(s)) {
        setForm({ ...form, skills: [...form.skills, s] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, role };
      if (role === 'RECRUITER') delete payload.skills;
      const res = await api.post('/api/auth/register', payload);
      login(res.data, res.data.token);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === 'object' && !data.message) {
        setError(Object.values(data).join(' | '));
      } else {
        setError(data?.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 540 }}>
        <div className="auth-logo"><span style={{ fontSize: '2.5rem' }}>🚀</span></div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join HireHub today</p>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Role Selector */}
        <div className="form-group">
          <label className="form-label">I am a...</label>
          <div className="role-selector">
            {['JOBSEEKER', 'RECRUITER'].map((r) => (
              <div
                key={r}
                className={`role-option ${role === r ? 'selected' : ''}`}
                onClick={() => setRole(r)}
              >
                <div className="role-option-icon">{r === 'JOBSEEKER' ? '🎯' : '👔'}</div>
                <div className="role-option-label">{r === 'JOBSEEKER' ? 'Job Seeker' : 'Recruiter'}</div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" name="name" placeholder="John Doe"
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" name="phone" placeholder="+91 9999999999"
                value={form.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" placeholder="Min 6 characters"
              value={form.password} onChange={handleChange} required />
          </div>

          {role === 'RECRUITER' && (
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input className="form-input" name="company" placeholder="Acme Corp"
                value={form.company} onChange={handleChange} />
            </div>
          )}

          {role === 'JOBSEEKER' && (
            <div className="form-group">
              <label className="form-label">Skills <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(press Enter or comma to add)</span></label>
              <input
                className="form-input"
                placeholder="e.g. React, Java, Python..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
              />
              {form.skills.length > 0 && (
                <div className="tags-list" style={{ marginTop: 10 }}>
                  {form.skills.map((s) => (
                    <span key={s} className="tag" style={{ cursor: 'pointer' }} onClick={() => removeSkill(s)}>
                      {s} ✕
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 8 }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
