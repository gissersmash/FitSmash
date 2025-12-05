import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HealthTable from "../components/HealthTable";
import ActivitySearch from "../components/ActivitySearch";
import { getHealthEntries, addHealthEntry, deleteHealthEntry, getStats } from "../services/healthService";
import { getFoodEntries, deleteFoodEntry } from "../services/foodEntryService";
import { setToken } from "../services/api";
import axios from "axios";
import { showNotification } from "../utils/notifications";

export default function TableauSuivi() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ weight: "", sleep_hours: "" });
  const [period, setPeriod] = useState("week");
  const [stats, setStats] = useState([]);
  const [activeTab, setActiveTab] = useState("health"); // "health", "activities" ou "nutrition"
  const [activities, setActivities] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [weight, setWeight] = useState(localStorage.getItem("userWeight") || "70");
  const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tous");
  const [foodHistory, setFoodHistory] = useState([]);
  const [nutritionPeriod, setNutritionPeriod] = useState("week");
  const [expandedDates, setExpandedDates] = useState(new Set());

  const token = localStorage.getItem("token");

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

  // Récupération des activités
  const fetchActivities = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/activities", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(res.data.activities || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Récupération des types d'activités
  const fetchActivityTypes = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/activities/types", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivityTypes(res.data.activities || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Récupération de l'historique nutrition
  const fetchFoodHistory = async () => {
    try {
      const res = await getFoodEntries();
      let entries = [];
      if (Array.isArray(res.data)) entries = res.data;
      else if (Array.isArray(res.data.entries)) entries = res.data.entries;
      else if (Array.isArray(res.data.data)) entries = res.data.data;
      
      // Filtrer selon la période
      const now = new Date();
      let startDate;
      
      if (nutritionPeriod === "week") {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
      } else if (nutritionPeriod === "month") {
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
      } else if (nutritionPeriod === "year") {
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
      }
      
      const filteredEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate;
      });
      
      setFoodHistory(filteredEntries);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFoodEntry = async (id) => {
    try {
      await deleteFoodEntry(id);
      showNotification("success", "Entrée supprimée");
      fetchFoodHistory();
    } catch (err) {
      showNotification("error", "Erreur lors de la suppression");
    }
  };

  const toggleDateExpansion = (date) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  // Grouper les aliments par date
  const groupedFoodHistory = foodHistory.reduce((acc, entry) => {
    const date = new Date(entry.date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {});

  // Trier les dates par ordre décroissant
  const sortedDates = Object.keys(groupedFoodHistory).sort((a, b) => new Date(b) - new Date(a));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "/login";

    setToken(token);
    fetchEntries();
    fetchStats(period);
    fetchActivities();
    fetchActivityTypes();
    fetchFoodHistory();
  }, []);

  useEffect(() => {
    fetchStats(period);
  }, [period]);

  useEffect(() => {
    fetchFoodHistory();
  }, [nutritionPeriod]);

  const handleInputChange = (e) => setNewEntry({ ...newEntry, [e.target.name]: e.target.value });

  const handleAddEntry = async (e) => {
    e.preventDefault();
    try {
      await addHealthEntry({
        weight: parseFloat(newEntry.weight),
        sleep: parseFloat(newEntry.sleep_hours),
        date: new Date()
      });
      setNewEntry({ weight: "", sleep_hours: "" });
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

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!selectedActivity || !duration) {
      showNotification("error", "Veuillez sélectionner une activité et une durée");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/activities",
        {
          name: selectedActivity,
          duration: parseInt(duration),
          weight: parseFloat(weight),
          date: activityDate,
          notes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification("success", res.data.message || "Activité ajoutée !");
      fetchActivities();
      setSelectedActivity("");
      setDuration("");
      setNotes("");
      localStorage.setItem("userWeight", weight);
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Erreur lors de l'ajout");
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification("success", "Activité supprimée");
      fetchActivities();
    } catch (err) {
      showNotification("error", "Erreur lors de la suppression");
    }
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity.name);
    setDuration(activity.duration.toString());
    // Les calories seront automatiquement calculées par l'API lors de l'ajout
  };

  const totalCaloriesBurned = activities.reduce((sum, a) => sum + (a.calories_burned || 0), 0);
  const categories = ["Tous", "Cardio", "Fitness", "Sports collectifs", "Sports de combat", "Autres"];
  const filteredTypes = categoryFilter === "Tous" 
    ? activityTypes 
    : activityTypes.filter(a => a.category === categoryFilter);

  return (
    <div style={{ minHeight: "100vh", background: "#FFFBEA" }}>
      <Sidebar />
      <div className="container d-flex justify-content-center" style={{ maxWidth: 900, marginTop: 40, marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="card shadow-lg p-4 mb-5 w-100" style={{ maxWidth: 900, background: 'linear-gradient(135deg, #e0ffe8 0%, #fffbe6 100%)', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,194,135,0.12)', transition: 'box-shadow 0.3s', animation: 'fadeIn 0.7s' }}>
          <h3 className="mb-4 text-center" style={{ color: '#1ec287', fontWeight: 'bold', letterSpacing: 1, textShadow: '0 2px 8px #cfcfc4' }}>
            <i className="bi bi-table" style={{ marginRight: 10 }}></i>
            Tableau de suivi
          </h3>

          {/* Onglets */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab("health")}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === "health" ? 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)' : 'white',
                color: activeTab === "health" ? 'white' : '#666',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: activeTab === "health" ? '0 4px 12px rgba(30, 194, 135, 0.3)' : 'none'
              }}
            >
              <i className="bi bi-heart-pulse me-2"></i>
              Données Santé
            </button>
            <button
              onClick={() => setActiveTab("activities")}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === "activities" ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'white',
                color: activeTab === "activities" ? 'white' : '#666',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: activeTab === "activities" ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none'
              }}
            >
              <i className="bi bi-activity me-2"></i>
              Activités Physiques
            </button>
            <button
              onClick={() => setActiveTab("nutrition")}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === "nutrition" ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'white',
                color: activeTab === "nutrition" ? 'white' : '#666',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: activeTab === "nutrition" ? '0 4px 12px rgba(245, 158, 11, 0.3)' : 'none'
              }}
            >
              <i className="bi bi-clipboard-data me-2"></i>
              Historique Nutrition
            </button>
          </div>

          {activeTab === "health" && (
            <>
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
                <div className="col-md-6">
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
                <div className="col-md-6">
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
          </>
          )}

          {/* Onglet Activités */}
          {activeTab === "activities" && (
            <>
              {/* Statistiques activités */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <div style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}>
                    <i className="bi bi-fire" style={{ fontSize: '32px', marginBottom: '8px' }}></i>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{Math.round(totalCaloriesBurned)}</div>
                    <div style={{ fontSize: '13px', opacity: 0.9 }}>Calories brûlées</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}>
                    <i className="bi bi-clock" style={{ fontSize: '32px', marginBottom: '8px' }}></i>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                      {activities.reduce((sum, a) => sum + (a.duration || 0), 0)}
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.9 }}>Minutes d'activité</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div style={{
                    background: 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(30, 194, 135, 0.3)'
                  }}>
                    <i className="bi bi-check-circle" style={{ fontSize: '32px', marginBottom: '8px' }}></i>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{activities.length}</div>
                    <div style={{ fontSize: '13px', opacity: 0.9 }}>Activités réalisées</div>
                  </div>
                </div>
              </div>

              {/* Formulaire ajout activité */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
              }}>
                <h5 style={{ color: '#ef4444', marginBottom: '20px', fontWeight: '600' }}>
                  <i className="bi bi-plus-circle-fill me-2"></i>
                  Ajouter une activité
                </h5>

                {/* Recherche d'activités via API Ninjas */}
                <ActivitySearch 
                  onActivitySelect={handleActivitySelect}
                  weight={parseFloat(weight)}
                  duration={parseInt(duration) || 60}
                />

                {/* Divider */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  margin: '20px 0',
                  gap: '10px'
                }}>
                  <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                  <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '500' }}>
                    OU sélectionnez dans la liste
                  </span>
                  <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                </div>

                <form onSubmit={handleAddActivity}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>Catégorie</label>
                      <select
                        className="form-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{ borderRadius: '10px', border: '2px solid #e5e7eb', padding: '10px 14px' }}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-8">
                      <label className="form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>Activité *</label>
                      <select
                        className="form-select"
                        value={selectedActivity}
                        onChange={(e) => setSelectedActivity(e.target.value)}
                        required
                        style={{ borderRadius: '10px', border: '2px solid #e5e7eb', padding: '10px 14px' }}
                      >
                        <option value="">Sélectionner...</option>
                        {filteredTypes.map((activity) => (
                          <option key={activity.name} value={activity.name}>
                            {activity.name} ({activity.met} MET)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>Durée (min) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        min="1"
                        required
                        style={{ borderRadius: '10px', border: '2px solid #e5e7eb', padding: '10px 14px' }}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>Poids (kg)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        min="30"
                        max="200"
                        step="0.1"
                        style={{ borderRadius: '10px', border: '2px solid #e5e7eb', padding: '10px 14px' }}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={activityDate}
                        onChange={(e) => setActivityDate(e.target.value)}
                        style={{ borderRadius: '10px', border: '2px solid #e5e7eb', padding: '10px 14px' }}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>&nbsp;</label>
                      <button
                        type="submit"
                        className="btn w-100"
                        style={{
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          fontWeight: 'bold',
                          padding: '10px',
                          borderRadius: '10px',
                          border: 'none'
                        }}
                      >
                        <i className="bi bi-plus-lg me-2"></i>
                        Ajouter
                      </button>
                    </div>
                    <div className="col-12">
                      <label className="form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>Notes (optionnel)</label>
                      <textarea
                        className="form-control"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="2"
                        placeholder="Commentaires sur votre activité..."
                        style={{ borderRadius: '10px', border: '2px solid #e5e7eb', padding: '10px 14px' }}
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Tableau des activités */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
              }}>
                <h5 style={{ color: '#ef4444', marginBottom: '20px', fontWeight: '600' }}>
                  <i className="bi bi-list-ul me-2"></i>
                  Historique des activités
                </h5>

                {activities.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    <i className="bi bi-inbox" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
                    <p>Aucune activité enregistrée</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead style={{ background: '#f8f9fa' }}>
                        <tr>
                          <th>Date</th>
                          <th>Activité</th>
                          <th>Durée</th>
                          <th>Calories</th>
                          <th>Notes</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map((activity) => (
                          <tr key={activity.id}>
                            <td>{new Date(activity.date).toLocaleDateString('fr-FR')}</td>
                            <td>
                              <strong>{activity.name}</strong>
                              <br />
                              <small style={{ color: '#666' }}>{activity.met_value} MET</small>
                            </td>
                            <td>{activity.duration} min</td>
                            <td>
                              <span style={{ 
                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                fontSize: '13px'
                              }}>
                                <i className="bi bi-fire me-1"></i>
                                {Math.round(activity.calories_burned)}
                              </span>
                            </td>
                            <td style={{ maxWidth: '200px', fontSize: '13px', color: '#666' }}>
                              {activity.notes || '-'}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteActivity(activity.id)}
                                style={{ borderRadius: '8px' }}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Onglet Historique Nutrition */}
          {activeTab === "nutrition" && (
            <>
              {/* Filtres période */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h5 style={{ color: '#f59e0b', fontWeight: '600', margin: 0 }}>
                    <i className="bi bi-calendar3 me-2"></i>
                    Période
                  </h5>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {['week', 'month', 'year'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setNutritionPeriod(p)}
                        style={{
                          padding: '8px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          background: nutritionPeriod === p ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : '#f3f4f6',
                          color: nutritionPeriod === p ? 'white' : '#666',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          fontSize: '14px'
                        }}
                      >
                        {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Année'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Statistiques nutrition */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <div style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                  }}>
                    <i className="bi bi-journal-text" style={{ fontSize: '32px', marginBottom: '8px' }}></i>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{foodHistory.length}</div>
                    <div style={{ fontSize: '13px', opacity: 0.9 }}>Entrées enregistrées</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}>
                    <i className="bi bi-fire" style={{ fontSize: '32px', marginBottom: '8px' }}></i>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                      {Math.round(foodHistory.reduce((sum, e) => sum + (Number(e.calories) || 0), 0))}
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.9 }}>Calories totales</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}>
                    <i className="bi bi-graph-up" style={{ fontSize: '32px', marginBottom: '8px' }}></i>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                      {foodHistory.length > 0 ? Math.round(foodHistory.reduce((sum, e) => sum + (Number(e.calories) || 0), 0) / foodHistory.length) : 0}
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.9 }}>Moyenne / repas</div>
                  </div>
                </div>
              </div>

              {/* Tableau historique */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
              }}>
                <h5 style={{ color: '#f59e0b', marginBottom: '20px', fontWeight: '600' }}>
                  <i className="bi bi-calendar-week me-2"></i>
                  Historique par jour
                </h5>

                {foodHistory.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    <i className="bi bi-inbox" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
                    <p>Aucune entrée pour cette période</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sortedDates.map((date) => {
                      const entries = groupedFoodHistory[date];
                      const totalCalories = entries.reduce((sum, e) => sum + (Number(e.calories) || 0), 0);
                      const isExpanded = expandedDates.has(date);
                      
                      return (
                        <div
                          key={date}
                          style={{
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            transition: 'all 0.3s'
                          }}
                        >
                          {/* En-tête de la date */}
                          <button
                            onClick={() => toggleDateExpansion(date)}
                            style={{
                              width: '100%',
                              background: isExpanded ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : '#f9fafb',
                              border: 'none',
                              padding: '16px 20px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <i 
                                className={`bi bi-chevron-${isExpanded ? 'down' : 'right'}`}
                                style={{ 
                                  fontSize: '20px', 
                                  color: isExpanded ? 'white' : '#f59e0b',
                                  transition: 'transform 0.3s'
                                }}
                              ></i>
                              <div style={{ textAlign: 'left' }}>
                                <div style={{ 
                                  fontWeight: 'bold', 
                                  fontSize: '16px',
                                  color: isExpanded ? 'white' : '#111827'
                                }}>
                                  {new Date(date).toLocaleDateString('fr-FR', { 
                                    weekday: 'long', 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}
                                </div>
                                <div style={{ 
                                  fontSize: '13px', 
                                  color: isExpanded ? 'rgba(255,255,255,0.9)' : '#6b7280',
                                  marginTop: '2px'
                                }}>
                                  {entries.length} aliment{entries.length > 1 ? 's' : ''} • {Math.round(totalCalories)} kcal
                                </div>
                              </div>
                            </div>
                            <div style={{
                              background: isExpanded ? 'rgba(255,255,255,0.2)' : '#fef3c7',
                              color: isExpanded ? 'white' : '#d97706',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontWeight: 'bold',
                              fontSize: '15px'
                            }}>
                              <i className="bi bi-fire me-1"></i>
                              {Math.round(totalCalories)} kcal
                            </div>
                          </button>

                          {/* Contenu détaillé */}
                          {isExpanded && (
                            <div style={{ background: 'white' }}>
                              <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                  <thead style={{ background: '#f8f9fa' }}>
                                    <tr>
                                      <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#666' }}>Aliment</th>
                                      <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#666' }}>Calories</th>
                                      <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#666' }}>Protéines</th>
                                      <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#666' }}>Glucides</th>
                                      <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#666' }}>Lipides</th>
                                      <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#666' }}></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {entries.map((entry) => (
                                      <tr key={entry.id}>
                                        <td style={{ padding: '12px 16px' }}>
                                          <strong style={{ color: '#111827', fontSize: '14px' }}>
                                            {entry.name || entry.foodName}
                                          </strong>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                          <span style={{ 
                                            background: '#fef3c7',
                                            color: '#d97706',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                            fontSize: '13px'
                                          }}>
                                            {Math.round(entry.calories || 0)} kcal
                                          </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#666' }}>
                                          {Math.round(entry.proteins || 0)}g
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#666' }}>
                                          {Math.round(entry.carbs || 0)}g
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#666' }}>
                                          {Math.round(entry.fats || 0)}g
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                          <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteFoodEntry(entry.id)}
                                            style={{ 
                                              borderRadius: '6px',
                                              padding: '4px 10px',
                                              fontSize: '13px'
                                            }}
                                          >
                                            <i className="bi bi-trash"></i>
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
