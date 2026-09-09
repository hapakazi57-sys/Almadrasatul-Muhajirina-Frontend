import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import Loader from '../../components/Loader/Loader';
import './Results.css';

export default function Results() {
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState('');
  const [results, setResults] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    api.get('/marks/sessions')
      .then(({ data }) => {
        setSessions(data);
        if (data.length > 0) setSession(data[0]);
      })
      .finally(() => setLoadingSessions(false));
  }, []);

  useEffect(() => {
    if (!session) { setResults([]); return; }
    setLoadingResults(true);
    api.get(`/results/session/${encodeURIComponent(session)}`)
      .then(({ data }) => setResults(data))
      .catch(() => {
        setResults([]);
        Swal.fire({ icon: 'info', title: 'Hakuna Matokeo', text: `Hakuna matokeo kwa Session: ${session}`, confirmButtonColor: '#154734' });
      })
      .finally(() => setLoadingResults(false));
  }, [session]);

  if (loadingSessions) return <Loader label="Inapakia Session za Mtihani..." />;

  return (
    <div className="res-page">
      <div className="res-section-title-row">
        <div className="res-field" style={{ marginBottom: 0, minWidth: 260 }}>
          <label>Chagua Session ya Mtihani</label>
          <select value={session} onChange={(e) => setSession(e.target.value)}>
            {sessions.length === 0 && <option value="">Hakuna Session bado</option>}
            {sessions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loadingResults ? <Loader /> : (
        <div className="res-card" style={{ overflowX: 'auto' }}>
          <table className="res-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Namba</th>
                <th>Jina</th>
                <th>Jumla</th>
                <th>Wastani</th>
                <th>Daraja</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.studentId} className={r.rank <= 3 ? 'res-top-rank-row' : ''}>
                  <td>
                    <span className={`res-rank-pill ${r.rank === 1 ? 'res-rank-gold' : r.rank === 2 ? 'res-rank-silver' : r.rank === 3 ? 'res-rank-bronze' : ''}`}>
                      {r.rank}
                    </span>
                  </td>
                  <td>
                    <div className="res-number-cell">
                      <span className="res-number-avatar">MU</span>
                      <span className="res-number-value">{r.studentNumber}</span>
                    </div>
                  </td>
                  <td>{r.fullName}</td>
                  <td>{r.totalScore}</td>
                  <td>{r.averageScore}</td>
                  <td><span className={`res-badge res-badge-grade-${r.overallGrade}`}>{r.overallGrade}</span></td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr><td colSpan={6} className="res-empty-row">Hakuna matokeo ya kuonyesha.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}