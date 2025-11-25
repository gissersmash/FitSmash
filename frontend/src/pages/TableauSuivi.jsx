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
      console.error("Erreur récupération entrées:", err);
    }
  };

  // Récupération des stats
  const fetchStats = async (p) => {
    try {
      const res = await getStats(p);
      setStats(res.data);
    } catch (err) {
      console.error("Erreur récupération stats:", err);
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
      console.error("Erreur ajout entrée:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHealthEntry(id);
      setEntries(entries.filter(e => e.id !== id));
      fetchStats(period);
    } catch (err) {
      console.error("Erreur suppression entrée:", err);
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

          {/* Formulaire ajout */}
          <form onSubmit={handleAddEntry} className="mb-4">
            <input
              name="weight"
              type="number"
              placeholder="Poids (kg)"
              value={newEntry.weight}
              onChange={handleInputChange}
              required
            />
            <input
              name="sleep_hours"
              type="number"
              placeholder="Sommeil (h)"
              value={newEntry.sleep_hours}
              onChange={handleInputChange}
              required
            />
            <input
              name="activity_minutes"
              type="number"
              placeholder="Activité (min)"
              value={newEntry.activity_minutes}
              onChange={handleInputChange}
              required
            />
            <select
              name="activity_type"
              className="form-select"
              value={newEntry.activity_type}
              onChange={handleInputChange}
              required
            >
              <option value="">Type d'activité</option>
              <option value="Course à pied">Course à pied</option>
              <option value="Vélo">Vélo</option>
              <option value="Natation">Natation</option>
              <option value="Marche">Marche</option>
              <option value="Musculation">Musculation</option>
              <option value="Yoga">Yoga</option>
              <option value="Fitness">Fitness</option>
              <option value="Tennis">Tennis</option>
              <option value="Football">Football</option>
              <option value="Basketball">Basketball</option>
              <option value="Boxe">Boxe</option>
              <option value="Danse">Danse</option>
              <option value="Escalade">Escalade</option>
              <option value="Randonnée">Randonnée</option>
              <option value="Ski">Ski</option>
              <option value="Rugby">Rugby</option>
              <option value="Badminton">Badminton</option>
              <option value="Crossfit">Crossfit</option>
              <option value="Pilates">Pilates</option>
              <option value="Arts martiaux">Arts martiaux</option>
              <option value="Golf">Golf</option>
              <option value="Aviron">Aviron</option>
              <option value="Roller">Roller</option>
              <option value="Skateboard">Skateboard</option>
              <option value="Surf">Surf</option>
              <option value="Plongée">Plongée</option>
              <option value="Equitation">Equitation</option>
              <option value="Volley">Volley</option>
              <option value="Handball">Handball</option>
              <option value="Triathlon">Triathlon</option>
              <option value="Marathon">Marathon</option>
              <option value="Trail">Trail</option>
              <option value="Canoë">Canoë</option>
              <option value="Snowboard">Snowboard</option>
              <option value="Patinage">Patinage</option>
              <option value="Spinning">Spinning</option>
              <option value="HIIT">HIIT</option>
              <option value="Stretching">Stretching</option>
              <option value="Zumba">Zumba</option>
              <option value="Aquagym">Aquagym</option>
            </select>
            <button type="submit" className="btn btn-success ms-2">Ajouter</button>
          </form>

          {/* Sélecteur période pour stats */}
          <div className="mb-3">
            <label>Période:</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="ms-2">
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
              <option value="year">Année</option>
            </select>
            <button className="btn btn-primary ms-2" onClick={() => fetchStats(period)}>Actualiser</button>
          </div>

          {/* Tableau */}
          <HealthTable entries={entries} onDelete={handleDelete} />
          
          {/* Stats par période */}
          <h6 className="mt-4" style={{ color: "#1ec287" }}>Stats ({period})</h6>
          <HealthTable entries={stats} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
