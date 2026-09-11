import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Information Incomplete',
        text: 'Please fill in all required fields.',
        confirmButtonColor: '#154734',
      });
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      login(data);
      Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: `You have logged in as ${data.fullName}`,
        confirmButtonColor: '#154734',
        timer: 1400,
        showConfirmButton: false,
      });
      navigate('/');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Login',
        text: err?.response?.data?.message || 'Username or Password is incorrect.',
        confirmButtonColor: '#154734',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      {/* Background yenye "white smoke" inayoelea */}
      {/* Background nyeupe yenye mistari inayotembea kurudi na kuenda */}
      <div className="login-bg-lines" />

      <div className="login-content">
        {/* LEFT: Brand panel */}
        <div className="login-brand-panel">
          <div className="login-brand-overlay" />
          <div className="login-brand-content">
            <div className="login-brand-header">
              <img src="/logo.png" alt="Nembo" className="login-logo" />
              <span className="login-uni-name">ALMADRASATUL MUHAJIRINA</span>
            </div>

            <div className="login-brand-bottom">
              <h1 className="login-brand-heading">
                Almadrasatul <span>Muhajirina</span>
              </h1>
              <p className="login-brand-tagline">Educate minds. Connect families.</p>

              <ul className="login-brand-features">
                <li>
                  <span className="check-icon">✓</span>
                  Manage student information securely
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Track enrollment and academic results
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Generate reports and analytics
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT: Form panel */}
        <div className="login-form-panel">
          <div className="login-card">
            <h2 className="login-card-title">Welcome Back</h2>
            <p className="login-sub">Sign in to your administrator dashboard</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="field">
                <label htmlFor="username">USERNAME</label>
                <div className="input-with-icon">
                  <span className="input-icon-box">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"
                        fill="#fff"
                      />
                    </svg>
                  </span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingiza Username"
                    autoFocus
                    autoComplete="new-username"
                  />
                </div>
              </div>

              <div className="field">
                <div className="field-label-row">
                  <label htmlFor="password">PASSWORD</label>
                </div>
                <div className="input-with-icon">
                  <span className="input-icon-box">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 10V8a6 6 0 1112 0v2h1a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1h1zm2 0h8V8a4 4 0 10-8 0v2z"
                        fill="#fff"
                      />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingiza Password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c5 0 9 4 10 7-.4 1.2-1.2 2.5-2.3 3.7M6.5 6.6C4.4 8 2.9 10 2 12c1 3 5 7 10 7 1.3 0 2.5-.2 3.6-.6"
                          stroke="#9fb3ab"
                          strokeWidth="1.6"
                          fill="none"
                        />
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
                          stroke="#9fb3ab"
                          strokeWidth="1.6"
                          fill="none"
                        />
                        <circle cx="12" cy="12" r="3" stroke="#9fb3ab" strokeWidth="1.6" fill="none" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                
                {loading ? 'Login...' : 'Login'}
              </button>
            </form>

            <p className="login-secure-note">🛡 Your information is secured</p>
          </div>
        </div>
      </div>

      <p className="login-footer">© 2026 Almadrasatul Muhajirina — Registration Management System</p>
    </div>
  );
}