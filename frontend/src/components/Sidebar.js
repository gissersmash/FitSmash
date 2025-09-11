import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="d-flex flex-column bg-light vh-100 p-3 shadow" style={{ minWidth: 220, position: 'fixed', left: 0, top: 0, zIndex: 1000 }}>
      <h4 className="mb-4 text-success" style={{ fontWeight: 'bold' }}>
        <img src="/logo/logo-fitsmash.png" alt="Logo SantéApp" style={{ height: 40, verticalAlign: 'middle' }} />
      </h4>
      <nav className="nav flex-column">
        <Link to="/dashboard" className="nav-link text-dark mb-2">
          <i className="bi bi-house me-2"></i>Dashboard
        </Link>
        <Link to="/tableau-suivi" className="nav-link text-dark mb-2">
          <i className="bi bi-table me-2"></i>Tableau de suivi
        </Link>
        <Link to="/graphique-sante" className="nav-link text-dark mb-2">
          <i className="bi bi-bar-chart me-2"></i>Graphique santé
        </Link>
        <Link to="/objectif" className="nav-link text-dark mb-2">
          <i className="bi bi-bullseye me-2"></i>Objectif
        </Link>
        <Link to="/suivi-nutrition" className="nav-link text-dark mb-2">
          <i className="bi bi-egg-fried me-2"></i>Suivi nutrition
        </Link>
        {/* Ajoute d'autres liens ici si besoin */}
      </nav>
    </div>
  );
}
