import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import Loader from '../../components/Loader/Loader';
import './Marks.css';

export default function MarksEntry() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ studentId: '', courseId: '', examSession: '', score: '' });
  const [, setStudentMarks] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/students'), api.get('/courses')])
      .then(([sRes, cRes]) => {
        setStudents(Array.isArray(sRes.data) ? sRes.data : (sRes.data?.students || sRes.data?.data || []));
        setCourses(Array.isArray(cRes.data) ? cRes.data : (cRes.data?.courses || cRes.data?.data || []));
      })
      .finally(() => setLoading(false));
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const loadStudentMarks = (studentId) => {
    if (!studentId) { setStudentMarks([]); return; }
    api.get(`/marks/student/${studentId}`)
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : (data?.marks || data?.data || []);
        setStudentMarks(list);
      })
      .catch(() => setStudentMarks([]));
  };

  const onStudentChange = (e) => {
    onChange(e);
    loadStudentMarks(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.courseId || !form.examSession || form.score === '') {
      Swal.fire({ icon: 'warning', title: 'Jaza taarifa zote', confirmButtonColor: '#154734' });
      return;
    }
    setSaving(true);
    try {
      await api.post('/marks', {
        studentId: Number(form.studentId),
        courseId: Number(form.courseId),
        examSession: form.examSession,
        score: Number(form.score),
      });
      Swal.fire({ icon: 'success', title: 'Alama Zimehifadhiwa', timer: 1200, showConfirmButton: false });
      setForm({ ...form, courseId: '', score: '' });
      loadStudentMarks(form.studentId);
    } catch (err) {
      Swal.fire({
        icon: 'error', title: 'Imeshindikana',
        text: err?.response?.data?.message || 'Kuna hitilafu imetokea.',
        confirmButtonColor: '#154734',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="marks-layout">
      {/* -------- Left: Form -------- */}
      <div className="card marks-form-card">
        <h3>Weka Alama za Mtihani</h3>

        <form onSubmit={onSubmit} className="marks-form">
          <div className="field">
            <label>Mwanafunzi</label>
            <select name="studentId" value={form.studentId} onChange={onStudentChange}>
              <option value="">-- Chagua Mwanafunzi --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.studentNumber} - {s.fullName}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Course</label>
            <select name="courseId" value={form.courseId} onChange={onChange}>
              <option value="">-- Chagua Course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Session ya Mtihani</label>
            <input name="examSession" value={form.examSession} onChange={onChange} placeholder="mfano: Term 2 - 2026" />
          </div>

          <div className="field">
            <label>Alama (0 - 100)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              name="score"
              className="marks-score-input"
              value={form.score}
              onChange={onChange}
              placeholder="0"
            />
          </div>

          <button type="submit" className="btn btn-primary marks-submit-btn" disabled={saving}>
            {saving ? 'Inahifadhi...' : 'Hifadhi Alama'}
          </button>
        </form>
      </div>

    </div>
  );
}