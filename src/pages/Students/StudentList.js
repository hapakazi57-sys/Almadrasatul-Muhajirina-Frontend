import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import Loader from '../../components/Loader/Loader';
import './StudentList.css';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = filter === 'ALL' ? {} : { status: filter };
    api.get('/students', { params })
      .then(({ data }) => {
        console.log('DEBUG students response:', data); // TUTAONA HAPA MUUNDO HALISI
        setStudents(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const handleDelete = (student) => {
    const studentId = student.id ?? student.studentId;
    Swal.fire({
      icon: 'warning',
      title: `Futa ${student.fullName}?`,
      text: 'Kitendo hiki hakiwezi kutenduliwa.',
      showCancelButton: true,
      confirmButtonText: 'Ndio, Futa',
      cancelButtonText: 'Ghairi',
      confirmButtonColor: '#B3261E',
      cancelButtonColor: '#154734',
    }).then((res) => {
      if (res.isConfirmed) {
        api.delete(`/students/${studentId}`).then(() => {
          Swal.fire({ icon: 'success', title: 'Amefutwa', timer: 1200, showConfirmButton: false });
          load();
        }).catch(() => {
          Swal.fire({ icon: 'error', title: 'Imeshindikana Kufuta', confirmButtonColor: '#154734' });
        });
      }
    });
  };

  const visible = students.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.studentNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="section-title-row">
        <div className="students-filters">
          <input
            className="students-search"
            placeholder="Tafuta kwa jina au namba..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">Wote</option>
            <option value="REGISTERED">Registered Tuu</option>
            <option value="EXAMINED">Waliofanya Mtihani</option>
          </select>
        </div>
        <Link to="/students/sajili" className="btn btn-primary">+ Sajili Mwanafunzi</Link>
      </div>

      {loading ? <Loader /> : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="amm-table">
            <thead>
              <tr>
                <th>Namba</th>
                <th>Jina</th>
                <th>Jinsia</th>
                <th>Mzazi/Mlezi</th>
                <th>Tarehe ya Usajili</th>
                <th>Hali</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
  {visible.map((s) => {
    const studentId = s.id ?? s.studentId;
    return (
      <tr key={studentId}>
        <td>{s.studentNumber}</td>
        <td data-initials={s.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}>
          {s.fullName}
        </td>
        <td>{s.gender === 'FEMALE' ? 'Mwanamke' : 'Mwanaume'}</td>
        <td>{s.guardianName || '-'}</td>
        <td>{s.registrationDate}</td>
        <td>
          <span className={`badge ${s.status === 'EXAMINED' ? 'badge-examined' : 'badge-registered'}`}>
            {s.status === 'EXAMINED' ? 'Amefanya Mtihani' : 'Registered Tuu'}
          </span>
        </td>
        <td>
          <div className="table-actions">
            <Link
              to={`/students/edit/${studentId}`}
              className="btn btn-outline table-action-btn"
            >
              Hariri
            </Link>
            <button
              className="btn btn-danger table-action-btn"
              onClick={() => handleDelete(s)}
            >
              Futa
            </button>
          </div>
        </td>
      </tr>
    );
  })}
  {visible.length === 0 && (
    <tr><td colSpan={7} className="empty-row">Hakuna wanafunzi wanaolingana na utafutaji.</td></tr>
  )}
</tbody>
          </table>
        </div>
      )}
    </div>
  );
}