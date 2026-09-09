import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Taarifa Hazitoshi',
        text: 'Tafadhali jaza Username na Password.',
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
        title: 'Karibu tena!',
        text: `Umeingia kama ${data.fullName}`,
        confirmButtonColor: '#154734',
        timer: 1400,
        showConfirmButton: false,
      });
      navigate('/');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Imeshindikana Kuingia',
        text: err?.response?.data?.message || 'Username au Password sio sahihi.',
        confirmButtonColor: '#154734',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-form-panel">
        <div className="login-form-wrap">
          <p className="login-eyebrow">Dashibodi ya Msimamizi</p>
          <h1>Karibu Tena</h1>
          <p className="login-sub">Ingia kusimamia usajili, masomo na matokeo ya wanafunzi.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="field">
              <label htmlFor="username">Username</label>
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
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingiza Password"
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
              {loading ? 'Inaingia...' : 'Ingia'}
            </button>
          </form>
        </div>
      </div>

      <div className="login-brand-panel">
        <div className="login-brand-row">
          <img src="/logo.png" alt="Nembo ya Almadrasatul Muhajirina" className="login-logo" />
          <h2 className="login-brand-name">ALMADRASATUL MUHAJIRINA</h2>
        </div>
        <p className="login-brand-tagline">Mfumo wa Usajili wa Wanafunzi na Matokeo</p>
      </div>
    </div>
  );
}
