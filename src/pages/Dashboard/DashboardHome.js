import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import Loader from '../../components/Loader/Loader';
import api from '../../api/axios';
import './Dashboard.css';

const titleByPath = {
  '/': 'Dashibodi',
  '/students': 'Wanafunzi',
  '/students/sajili': 'Sajili Mwanafunzi Mpya',
  '/courses': 'Masomo (Courses)',
  '/marks': 'Weka Alama za Mtihani',
  '/results': 'Matokeo na Rank',
  '/reports': 'Ripoti (Reports)',
};

// ---------- DashboardLayout (default export) ----------
export default function DashboardLayout() {
  const location = useLocation();
  const title = titleByPath[location.pathname] || 'Dashibodi';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`dashboard-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={sidebarOpen} onNavigate={closeSidebar} />

      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      />

      <div className="dashboard-main">
        <Navbar title={title} onToggleSidebar={toggleSidebar} />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// ---------- Icons ndogo za stat cards ----------
function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function IconTrophy() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M5 9a3 3 0 0 1-3-3V5h3" />
      <path d="M19 9a3 3 0 0 0 3-3V5h-3" />
    </svg>
  );
}

// ---------- DashboardHome (named export) ----------
export function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/students/stats')
      .then(({ data }) => setStats(data))
      .catch(() => setStats({ total: 0, examined: 0, registeredOnly: 0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Inapakia takwimu..." />;

  const examinedPct = stats.total > 0 ? Math.round((stats.examined / stats.total) * 100) : 0;

  return (
    <div className="dashboard-home">
      <div className="stats-grid">
        <div className="card stat-card stat-card-primary">
          <div className="stat-card-top">
            <div className="stat-card-icon"><IconUsers /></div>
            <span className="stat-card-trend">Jumla</span>
          </div>
          <p className="stat-card-value">{stats.total}</p>
          <p className="stat-card-label">Wanafunzi Waliosajiliwa</p>
        </div>

        <div className="card stat-card stat-card-success">
          <div className="stat-card-top">
            <div className="stat-card-icon"><IconCheck /></div>
            <span className="stat-card-trend">{examinedPct}%</span>
          </div>
          <p className="stat-card-value">{stats.examined}</p>
          <p className="stat-card-label">Waliofanya Mtihani</p>
          <div className="stat-card-progress">
            <div className="stat-card-progress-fill" style={{ width: `${examinedPct}%` }} />
          </div>
        </div>

        <div className="card stat-card stat-card-gold">
          <div className="stat-card-top">
            <div className="stat-card-icon"><IconClock /></div>
            <span className="stat-card-trend">Pending</span>
          </div>
          <p className="stat-card-value">{stats.registeredOnly}</p>
          <p className="stat-card-label">Registered (Hawajafanya Mtihani)</p>
        </div>
      </div>

      <div className="card quick-actions-card">
        <div className="quick-actions-header">
          <h3>Vitendo vya Haraka</h3>
          <p>Anza kwa kusajili mwanafunzi, kuweka Course, kuweka alama, au kutazama matokeo na ripoti.</p>
        </div>
        <div className="quick-actions-grid">
          <Link to="/students/sajili" className="quick-action-item quick-action-primary">
            <span className="quick-action-icon"><IconPlus /></span>
            <span className="quick-action-text">
              <strong>Sajili Mwanafunzi</strong>
              <small>Ongeza mwanafunzi mpya</small>
            </span>
          </Link>
          <Link to="/courses" className="quick-action-item">
            <span className="quick-action-icon"><IconBook /></span>
            <span className="quick-action-text">
              <strong>Ongeza Course</strong>
              <small>Simamia masomo</small>
            </span>
          </Link>
          <Link to="/marks" className="quick-action-item">
            <span className="quick-action-icon"><IconEdit /></span>
            <span className="quick-action-text">
              <strong>Weka Alama</strong>
              <small>Ingiza alama za mtihani</small>
            </span>
          </Link>
          <Link to="/results" className="quick-action-item quick-action-gold">
            <span className="quick-action-icon"><IconTrophy /></span>
            <span className="quick-action-text">
              <strong>Tazama Matokeo</strong>
              <small>Rank na matokeo kamili</small>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}