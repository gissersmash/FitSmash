import React from "react";
import HealthTable from "../components/HealthTable";
import { useState, useEffect } from "react";
import { getHealthEntries, deleteHealthEntry } from "../services/healthService";
import Sidebar from '../components/Sidebar';

export default function TableauSuivi() {
  const [entries, setEntries] = useState([]);

  const [unauthorized, setUnauthorized] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUnauthorized(true);
      return;
    }
    require('../services/api').setToken(token);
    getHealthEntries()
      .then(res => {
        setEntries(Array.isArray(res) ? res : res.data);
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          setUnauthorized(true);
        }
      });
  }, []);

  const handleEdit = entry => {
    // Ajoute la logique d'édition si besoin
  };

  const handleDelete = id => {
    deleteHealthEntry(id).then(() => {
      setEntries(entries.filter(e => e._id !== id));
    });
  };

  if (unauthorized) {
    window.location.href = '/login';
    return null;
  }
  return (
    <div style={{ minHeight: '100vh', background: '#FFFBEA' }}>
      <Sidebar />
      <div className="container" style={{ maxWidth: 900, marginTop: 40, marginLeft: 240 }}>
        <div className="card shadow p-3 mb-4">
          <h5 className="mb-3" style={{ color: "#1ec287" }}>Tableau de suivi</h5>
          <HealthTable entries={entries} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
