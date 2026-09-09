import React from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'M';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function Navbar({ title, onToggleSidebar }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      icon: 'question',
      title: 'Una uhakika unataka kutoka?',
      showCancelButton: true,
      confirmButtonText: 'Ndio, Toka',
      cancelButtonText: 'Ghairi',
      confirmButtonColor: '#154734',
      cancelButtonColor: '#B3261E',
    }).then((res) => {
      if (res.isConfirmed) {
        logout();
        navigate('/login');
      }
    });
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="navbar-hamburger"
          onClick={onToggleSidebar}
          aria-label="Fungua Menu"
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="navbar-title">{title}</h1>
      </div>

      <div className="navbar-admin">
        <div className="navbar-admin-info">
          <p className="navbar-admin-name">{admin?.fullName || 'Msimamizi'}</p>
          <p className="navbar-admin-role">Msimamizi Mkuu</p>
        </div>
        <div className="navbar-avatar">{getInitials(admin?.fullName)}</div>
        <button className="btn btn-outline navbar-logout" onClick={handleLogout}>
          Toka
        </button>
      </div>
    </header>
  );
}