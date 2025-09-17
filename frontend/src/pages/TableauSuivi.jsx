import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HealthTable from "../components/HealthTable";
import { getHealthEntries, addHealthEntry, deleteHealthEntry, getStats } from "../services/healthService";
import { setToken } from "../services/api";

export default function TableauSuivi() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ weight: "", sleep_hours: "", activity_minutes: "" });
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
        date: new Date()
      });
      setNewEntry({ weight: "", sleep_hours: "", activity_minutes: "" });
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
      <div className="container" style={{ maxWidth: 900, marginTop: 40, marginLeft: 240 }}>
        <div className="card shadow p-3 mb-4">
          <h5 className="mb-3" style={{ color: "#1ec287" }}>Tableau de suivi</h5>

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
