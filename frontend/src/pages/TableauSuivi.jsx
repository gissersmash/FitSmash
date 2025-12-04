import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HealthTable from "../components/HealthTable";
import { getHealthEntries, addHealthEntry, deleteHealthEntry, getStats } from "../services/healthService";
import { setToken } from "../services/api";

export default function TableauSuivi() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ weight: "", sleep_hours: "", activity_minutes: "", activity_type: "" });
  const [period, setPeriod] = useState("week");
  const [stats, setStats] = useState([]);

  // Récupération des entrées santé
  const fetchEntries = async () => {
    try {
      const res = await getHealthEntries();
      setEntries(res.data);
    } catch (err) {
      // Erreur silencieuse
    }
  };

  // Récupération des stats
  const fetchStats = async (p) => {
    try {
      const res = await getStats(p);
      setStats(res.data);
    } catch (err) {
      // Erreur silencieuse
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "/login";

    setToken(token);
    fetchEntries();
    fetchStats(period);
  }, []);

  useEffect(() => {
    fetchStats(period);
  }, [period]);

  const handleInputChange = (e) => setNewEntry({ ...newEntry, [e.target.name]: e.target.value });

  const handleAddEntry = async (e) => {
    e.preventDefault();
    try {
      await addHealthEntry({
        weight: parseFloat(newEntry.weight),
        sleep: parseFloat(newEntry.sleep_hours),
        activity: parseFloat(newEntry.activity_minutes),
        activity_type: newEntry.activity_type,
        date: new Date()
      });
      setNewEntry({ weight: "", sleep_hours: "", activity_minutes: "", activity_type: "" });
      fetchEntries();
      fetchStats(period);
    } catch (err) {
      // Error handled silently
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHealthEntry(id);
      setEntries(entries.filter(e => e.id !== id));
      fetchStats(period);
    } catch (err) {
      // Erreur silencieuse
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFBEA" }}>
      <Sidebar />
      <div className="container d-flex justify-content-center" style={{ maxWidth: 900, marginTop: 40, marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="card shadow-lg p-4 mb-5 w-100" style={{ maxWidth: 900, background: 'linear-gradient(135deg, #e0ffe8 0%, #fffbe6 100%)', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,194,135,0.12)', transition: 'box-shadow 0.3s', animation: 'fadeIn 0.7s' }}>
          <h3 className="mb-4 text-center" style={{ color: '#1ec287', fontWeight: 'bold', letterSpacing: 1, textShadow: '0 2px 8px #cfcfc4' }}>
            <i className="bi bi-table" style={{ marginRight: 10 }}></i>
            Tableau de suivi
          </h3>

          {/* Statistiques rapides */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div style={{
                background: 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)',
                borderRadius: '16px',
                padding: '20px',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(30, 194, 135, 0.3)',
                transform: 'translateY(0)',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <i className="bi bi-bar-chart-fill" style={{ fontSize: '32px', marginBottom: '8px' }}></i>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{entries.length}</div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>Total entrées</div>
              </div>
            </div>
            <div className="col-md-4">
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '16px',
                padding: '20px',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                transform: 'translateY(0)',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <i className="bi bi-speedometer2" style={{ fontSize: '32px', marginBottom: '8px' }}></i>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                  {entries.length > 0 ? (entries.reduce((sum, e) => sum + (parseFloat(e.weight) || 0), 0) / entries.length).toFixed(1) : '0'}
                </div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>Poids moyen (kg)</div>
              </div>
            </div>
            <div className="col-md-4">
              <div style={{
                background: 'linear-gradient(135deg, #ffc107 0%, #ffa000 100%)',
                borderRadius: '16px',
                padding: '20px',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)',
                transform: 'translateY(0)',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <i className="bi bi-moon-stars-fill" style={{ fontSize: '32px', marginBottom: '8px' }}></i>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                  {entries.length > 0 ? (entries.reduce((sum, e) => sum + (parseFloat(e.sleep) || 0), 0) / entries.length).toFixed(1) : '0'}
                </div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>Sommeil moyen (h)</div>
              </div>
            </div>
          </div>

          {/* Formulaire ajout amélioré */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
          }}>
            <h5 style={{ color: '#1ec287', marginBottom: '20px', fontWeight: '600' }}>
              <i className="bi bi-plus-circle-fill me-2"></i>
              Ajouter une entrée
            </h5>
            <form onSubmit={handleAddEntry}>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>Poids (kg)</label>
                  <input
                    name="weight"
                    type="number"
                    step="0.1"
                    className="form-control"
                    placeholder="Ex: 70.5"
                    value={newEntry.weight}
                    onChange={handleInputChange}
                    required
                    style={{
                      borderRadius: '10px',
                      border: '2px solid #e5e7eb',
                      padding: '10px 14px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>Sommeil (h)</label>
                  <input
                    name="sleep_hours"
                    type="number"
                    step="0.5"
                    className="form-control"
                    placeholder="Ex: 7.5"
                    value={newEntry.sleep_hours}
                    onChange={handleInputChange}
                    required
                    style={{
                      borderRadius: '10px',
                      border: '2px solid #e5e7eb',
                      padding: '10px 14px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>Activité (min)</label>
                  <input
                    name="activity_minutes"
                    type="number"
                    className="form-control"
                    placeholder="Ex: 45"
                    value={newEntry.activity_minutes}
                    onChange={handleInputChange}
                    required
                    style={{
                      borderRadius: '10px',
                      border: '2px solid #e5e7eb',
                      padding: '10px 14px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>Type d'activité</label>
                  <select
                    name="activity_type"
                    className="form-select"
                    value={newEntry.activity_type}
                    onChange={handleInputChange}
                    required
                    style={{
                      borderRadius: '10px',
                      border: '2px solid #e5e7eb',
                      padding: '10px 14px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Choisir...</option>
                    <option value="Course à pied">Course à pied</option>
                    <option value="Vélo">🚴 Vélo</option>
                    <option value="Natation">🏊 Natation</option>
                    <option value="Marche">🚶 Marche</option>
                    <option value="Musculation">Musculation</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Fitness">🤸 Fitness</option>
                    <option value="Tennis">🎾 Tennis</option>
                    <option value="Football">⚽ Football</option>
                    <option value="Basketball">🏀 Basketball</option>
                    <option value="Boxe">🥊 Boxe</option>
                    <option value="Danse">💃 Danse</option>
                    <option value="Escalade">🧗 Escalade</option>
                    <option value="Randonnée">🥾 Randonnée</option>
                    <option value="Ski">⛷️ Ski</option>
                    <option value="Rugby">🏉 Rugby</option>
                    <option value="Badminton">🏸 Badminton</option>
                    <option value="Crossfit">🏋️ Crossfit</option>
                    <option value="Pilates">Pilates</option>
                    <option value="Arts martiaux">🥋 Arts martiaux</option>
                    <option value="Golf">⛳ Golf</option>
                    <option value="Aviron">🚣 Aviron</option>
                    <option value="Roller">⛸️ Roller</option>
                    <option value="Skateboard">🛹 Skateboard</option>
                    <option value="Surf">🏄 Surf</option>
                    <option value="Plongée">🤿 Plongée</option>
                    <option value="Equitation">🏇 Equitation</option>
                    <option value="Volley">🏐 Volley</option>
                    <option value="Handball">🤾 Handball</option>
                    <option value="Triathlon">Triathlon</option>
                    <option value="Marathon">Marathon</option>
                    <option value="Trail">Trail</option>
                    <option value="Canoë">🛶 Canoë</option>
                    <option value="Snowboard">🏂 Snowboard</option>
                    <option value="Patinage">⛸️ Patinage</option>
                    <option value="Spinning">Spinning</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Stretching">Stretching</option>
                    <option value="Zumba">Zumba</option>
                    <option value="Aquagym">Aquagym</option>
                  </select>
                </div>
              </div>
              <div className="text-end mt-3">
                <button 
                  type="submit" 
                  className="btn"
                  style={{
                    background: 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 28px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(30, 194, 135, 0.3)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Ajouter l'entrée
                </button>
              </div>
            </form>
          </div>

          {/* Sélecteur période pour stats */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ margin: 0, fontWeight: '600', color: '#333', fontSize: '14px' }}>
                <i className="bi bi-calendar3 me-2"></i>
                Période des statistiques:
              </label>
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
                className="form-select"
                style={{
                  width: 'auto',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  padding: '6px 12px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <option value="week">📅 Cette semaine</option>
                <option value="month">📆 Ce mois</option>
                <option value="year">📊 Cette année</option>
              </select>
            </div>
            <button 
              className="btn"
              onClick={() => fetchStats(period)}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 20px',
                fontWeight: '600',
                fontSize: '14px',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
              }}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Actualiser
            </button>
          </div>

          {/* Tableau des entrées */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
          }}>
            <h5 style={{ color: '#1ec287', marginBottom: '20px', fontWeight: '600' }}>
              <i className="bi bi-list-check me-2"></i>
              Toutes mes entrées
            </h5>
            <HealthTable entries={entries} onDelete={handleDelete} />
          </div>
          
          {/* Stats par période */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
          }}>
            <h5 style={{ color: '#3b82f6', marginBottom: '20px', fontWeight: '600' }}>
              <i className="bi bi-graph-up me-2"></i>
              Statistiques - {period === 'week' ? 'Semaine' : period === 'month' ? 'Mois' : 'Année'}
            </h5>
            <HealthTable entries={stats} onDelete={handleDelete} showActions={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
