import React from 'react';
import './css/LoadingModal.css';

const LoadingModal = ({ visible = false, text = "Carregando..." }) => {
  if (!visible) return null;

  return (
    <div className="loading-modal-overlay">
      <div className="loading-modal-content">
        <div className="spinner"></div>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default LoadingModal;
