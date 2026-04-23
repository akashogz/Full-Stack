import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <span>JobPortal</span>
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
            🔍 <span>Jobs</span>
          </NavLink>

          {user && (
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              📊 <span>Dashboard</span>
            </NavLink>
          )}

          {user?.role === 'RECRUITER' && (
            <NavLink to="/post-job" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              ➕ <span>Post Job</span>
            </NavLink>
          )}

          {user ? (
            <>
              <span className="nav-badge">{user.role === 'RECRUITER' ? '👔 Recruiter' : '🎯 Seeker'}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginLeft: 4 }}>
                {user.name}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ marginLeft: 8 }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost btn-sm">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
