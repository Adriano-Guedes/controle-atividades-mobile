import React from "react";

export default function Header({ nomeUsuario, onLogout, goToMaterias, goToHome }) {
  return (
    <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
      <a
        onClick={(e) => e.preventDefault()}
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
      >
        <span className="fs-4">{nomeUsuario}</span>
      </a>
      <ul className="nav nav-pills">
      <li className="px-1 nav-item">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={goToHome}
          >
            Home
          </button>
        </li>
      <li className="px-1 nav-item">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={goToMaterias}
          >
            Materias
          </button>
        </li>
        <li className="px-1 nav-item">
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={onLogout}
          >
            Sair
          </button>
        </li>
      </ul>
    </header>
  );
}
