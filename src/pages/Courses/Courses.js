import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import Loader from '../../components/Loader/Loader';
import './Courses.css';

const empty = { code: '', name: '', description: '' };

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/courses').then(({ data }) => setCourses(data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const isEditing = editingId !== null;

  const onEdit = (course) => {
    setEditingId(course.id);
    setForm({
      code: course.code || '',
      name: course.name || '',
      description: course.description || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setForm(empty);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.name.trim()) {
      Swal.fire({ icon: 'warning', title: 'Jaza Code na Jina la Course', confirmButtonColor: '#154734' });
      return;
    }
    setSaving(true);
    try {
      if (isEditing) {
        await api.put(`/courses/${editingId}`, form);
        Swal.fire({ icon: 'success', title: 'Course Imesasishwa', timer: 1200, showConfirmButton: false });
      } else {
        await api.post('/courses', form);
        Swal.fire({ icon: 'success', title: 'Course Imeongezwa', timer: 1200, showConfirmButton: false });
      }
      setForm(empty);
      setEditingId(null);
      load();
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

  const onDelete = (course) => {
    Swal.fire({
      icon: 'warning', title: `Futa Course "${course.name}"?`,
      showCancelButton: true, confirmButtonText: 'Ndio, Futa', cancelButtonText: 'Ghairi',
      confirmButtonColor: '#B3261E', cancelButtonColor: '#154734',
    }).then((res) => {
      if (res.isConfirmed) {
        api.delete(`/courses/${course.id}`).then(() => {
          Swal.fire({ icon: 'success', title: 'Imefutwa', timer: 1000, showConfirmButton: false });
          if (editingId === course.id) { setEditingId(null); setForm(empty); }
          load();
        });
      }
    });
  };

  return (
    <div className="courses-layout">
      <div className="card courses-form-card">
        <h3>{isEditing ? 'Hariri Course' : 'Ongeza Course Mpya'}</h3>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label>Course Code</label>
            <input name="code" value={form.code} onChange={onChange} placeholder="mfano: ARB101" />
          </div>
          <div className="field">
            <label>Jina la Course</label>
            <input name="name" value={form.name} onChange={onChange} placeholder="mfano: Lugha ya Kiarabu" />
          </div>
          <div className="field">
            <label>Maelezo (Hiari)</label>
            <textarea name="description" value={form.description} onChange={onChange} rows={3} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" disabled={saving}>
              {saving ? 'Inahifadhi...' : isEditing ? 'Sasisha Course' : 'Ongeza Course'}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-secondary" onClick={onCancelEdit} disabled={saving}>
                Ghairi
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card courses-list-card">
        <h3>Courses Zilizopo</h3>
        {loading ? <Loader /> : (
          <div className="courses-grid">
            {courses.map((c) => (
              <div key={c.id} className={`course-chip ${editingId === c.id ? 'course-chip-editing' : ''}`}>
                <div>
                  <p className="course-code">{c.code}</p>
                  <p className="course-name">{c.name}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary table-action-btn" onClick={() => onEdit(c)}>Hariri</button>
                  <button className="btn btn-danger table-action-btn" onClick={() => onDelete(c)}>Futa</button>
                </div>
              </div>
            ))}
            {courses.length === 0 && <p className="empty-row">Bado hakuna Course iliyowekwa.</p>}
          </div>
        )}
      </div>
    </div>
  );
}