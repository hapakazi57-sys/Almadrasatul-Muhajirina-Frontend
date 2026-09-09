import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import Loader from '../../components/Loader/Loader';
import './Reports.css';

async function downloadPdf(url, filename) {
  try {
    const response = await api.get(url, { responseType: 'blob' });
    const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    Swal.fire({
      icon: 'error', title: 'Imeshindikana Kupata Ripoti',
      text: 'Hakikisha umeweka taarifa sahihi kabla ya kuomba ripoti hii.',
      confirmButtonColor: '#154734',
    });
  }
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [studentId, setStudentId] = useState('');
  const [studentSession, setStudentSession] = useState('');
  const [sessionForReport, setSessionForReport] = useState('');

  useEffect(() => {
    Promise.all([api.get('/students'), api.get('/marks/sessions')])
      .then(([sRes, sessRes]) => {
        setStudents(sRes.data);
        setSessions(sessRes.data);
        if (sessRes.data.length > 0) setSessionForReport(sessRes.data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="reports-page-header">
        <div>
          <h2 className="reports-title">Ripoti (Reports)</h2>
          <p className="reports-subtitle">Chagua na pakua ripoti unayohitaji hapa chini</p>
        </div>
      </div>

      <div className="reports-grid">
        {/* -------- Ripoti ya Mwanafunzi Mmoja -------- */}
        <div className="card report-card">
          <div className="report-card-body">
            <div className="report-card-header">
              <img src="/logo.png" alt="Nembo ya Madrasa" className="report-logo" />
              <h3>Ripoti ya Mwanafunzi Mmoja</h3>
            </div>
            <p className="report-desc">Chapisha ripoti ya matokeo ya mwanafunzi mmoja aliyefanya mtihani, ikiwa na Rank yake.</p>

            <div className="report-card-fields">
              <div className="field">
                <label>Mwanafunzi</label>
                <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                  <option value="">-- Chagua Mwanafunzi --</option>
                  {students.filter(s => s.status === 'EXAMINED').map((s) => (
                    <option key={s.id} value={s.id}>{s.studentNumber} - {s.fullName}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Session ya Mtihani</label>
                <select value={studentSession} onChange={(e) => setStudentSession(e.target.value)}>
                  <option value="">-- Chagua Session --</option>
                  {sessions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <button
              className="btn btn-primary"
              disabled={!studentId || !studentSession}
              onClick={() => downloadPdf(
                `/reports/student/${studentId}/session/${encodeURIComponent(studentSession)}`,
                `ripoti-mwanafunzi.pdf`
              )}
            >
              <DownloadIcon /> Pakua Ripoti (PDF)
            </button>
          </div>
        </div>

        {/* -------- Ripoti ya Session -------- */}
        <div className="card report-card report-card-featured">
          <span className="report-featured-tag">Maarufu</span>
          <div className="report-card-body">
            <div className="report-card-header">
              <img src="/logo.png" alt="Nembo ya Madrasa" className="report-logo" />
              <h3>Ripoti ya Wanafunzi Wote Waliofanya Mtihani</h3>
            </div>
            <p className="report-desc">Orodha kamili ya wanafunzi waliofanya mtihani kwa Session husika, ikiwa na Rank ya kila mmoja.</p>

            <div className="report-card-fields">
              <div className="field">
                <label>Session ya Mtihani</label>
                <select value={sessionForReport} onChange={(e) => setSessionForReport(e.target.value)}>
                  {sessions.length === 0 && <option value="">Hakuna Session bado</option>}
                  {sessions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <button
              className="btn btn-primary"
              disabled={!sessionForReport}
              onClick={() => downloadPdf(
                `/reports/session/${encodeURIComponent(sessionForReport)}`,
                `matokeo-${sessionForReport}.pdf`
              )}
            >
              <DownloadIcon /> Pakua Ripoti (PDF)
            </button>
          </div>
        </div>

        {/* -------- Ripoti ya Wanafunzi Wote -------- */}
        <div className="card report-card">
          <div className="report-card-body">
            <div className="report-card-header">
              <img src="/logo.png" alt="Nembo ya Madrasa" className="report-logo" />
              <h3>Ripoti ya Wanafunzi Wote Waliosajiliwa</h3>
            </div>
            <p className="report-desc">Idadi kamili ya wanafunzi wote waliosajiliwa Madrasa, bila kujali wamefanya mtihani au bado wako Registered tuu.</p>

            <button
              className="btn btn-primary"
              onClick={() => downloadPdf('/reports/registered', 'wanafunzi-waliosajiliwa.pdf')}
            >
              <DownloadIcon /> Pakua Ripoti (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}