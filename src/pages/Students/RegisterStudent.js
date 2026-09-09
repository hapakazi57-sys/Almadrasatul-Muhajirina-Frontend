import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/Loader/Loader';
import './RegisterStudent.css';

const empty = {
  fullName: '', gender: 'MALE', dateOfBirth: '',
  guardianName: '', guardianPhone: '', address: '',
};

export default function RegisterStudent() {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    console.log('DEBUG -> id kutoka URL:', id, '| isEditMode:', isEditMode);

    if (!isEditMode) {
      setForm(empty);
      return;
    }

    setLoading(true);
    api.get(`/students/${id}`)
      .then(({ data }) => {
        console.log('DEBUG student fetched:', data);
        setForm({
          fullName: data.fullName || '',
          gender: data.gender || 'MALE',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : '',
          guardianName: data.guardianName || '',
          guardianPhone: data.guardianPhone || '',
          address: data.address || '',
        });
      })
      .catch((err) => {
        console.error('DEBUG fetch error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Imeshindikana Kupakia Taarifa',
          text: 'Mwanafunzi huyu hakupatikana.',
          confirmButtonColor: '#154734',
        }).then(() => navigate('/students'));
      })
      .finally(() => setLoading(false));
  }, [id, isEditMode, navigate]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      Swal.fire({ icon: 'warning', title: 'Jina Linahitajika', confirmButtonColor: '#154734' });
      return;
    }
    setSaving(true);
    try {
      if (isEditMode) {
        await api.put(`/students/${id}`, form);
        Swal.fire({
          icon: 'success',
          title: 'Taarifa Zimesasishwa!',
          confirmButtonColor: '#154734',
          timer: 1400,
          showConfirmButton: false,
        });
      } else {
        const { data } = await api.post('/students', form);
        Swal.fire({
          icon: 'success',
          title: 'Mwanafunzi Amesajiliwa!',
          html: `Namba ya Usajili: <b>${data.studentNumber}</b>`,
          confirmButtonColor: '#154734',
        });
        setForm(empty);
      }
      navigate('/students');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Imeshindikana',
        text: err?.response?.data?.message || 'Kuna hitilafu imetokea.',
        confirmButtonColor: '#154734',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="card students-form-card">
      <h3>{isEditMode ? 'Hariri Taarifa za Mwanafunzi' : 'Sajili Mwanafunzi Mpya'}</h3>
      <p className="form-hint">
        {isEditMode
          ? 'Fanya mabadiliko unayohitaji kisha uhifadhi.'
          : 'Namba ya usajili itatengenezwa kiotomatiki mara baada ya kuhifadhi.'}
      </p>

      <form onSubmit={onSubmit} className="students-form-grid">
        <div className="field">
          <label>Jina Kamili</label>
          <input name="fullName" value={form.fullName} onChange={onChange} placeholder="mfano: Ahmad Said Juma" />
        </div>

        <div className="field">
          <label>Jinsia</label>
          <select name="gender" value={form.gender} onChange={onChange}>
            <option value="MALE">Mwanaume</option>
            <option value="FEMALE">Mwanamke</option>
          </select>
        </div>

        <div className="field">
          <label>Tarehe ya Kuzaliwa</label>
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={onChange} />
        </div>

        <div className="field">
          <label>Jina la Mzazi/Mlezi</label>
          <input name="guardianName" value={form.guardianName} onChange={onChange} placeholder="mfano: Said Juma" />
        </div>

        <div className="field">
          <label>Namba ya Simu ya Mzazi/Mlezi</label>
          <input name="guardianPhone" value={form.guardianPhone} onChange={onChange} placeholder="mfano: 0777 123 456" />
        </div>

        <div className="field students-form-full">
          <label>Anuani</label>
          <textarea name="address" value={form.address} onChange={onChange} rows={3} placeholder="Mtaa, Kata, Wilaya" />
        </div>

        <div className="students-form-full page-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Inahifadhi...' : (isEditMode ? 'Sasisha Taarifa' : 'Hifadhi Mwanafunzi')}
          </button>
        </div>
      </form>
    </div>
  );
}