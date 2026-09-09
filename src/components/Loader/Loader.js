import React from 'react';
import './Loader.css';

export default function Loader({ label = 'Inapakia...' }) {
  return (
    <div className="loader-wrap">
      <div className="loader-spinner" />
      <p>{label}</p>
    </div>
  );
}
