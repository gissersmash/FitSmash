import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { showNotification } from "../utils/notifications";
import styles from "../styles/Dashboard.module.css";

export default function ActivitiesTracker() {
  const [activities, setActivities] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [weight, setWeight] = useState(localStorage.getItem("userWeight") || "70");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("Tous");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchActivities();
    fetchActivityTypes();
  }, []);

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

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!selectedActivity || !duration) {
      showNotification("error", "Veuillez sélectionner une activité et une durée");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/activities",
        {
          name: selectedActivity,
          duration: parseInt(duration),
          weight: parseFloat(weight),
          date,
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
    } finally {
      setLoading(false);
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

  const totalCaloriesBurned = activities.reduce((sum, a) => sum + (a.calories_burned || 0), 0);
  const totalDuration = activities.reduce((sum, a) => sum + (a.duration || 0), 0);
  
  const categories = ["Tous", "Cardio", "Fitness", "Sports collectifs", "Sports de combat", "Autres"];
  const filteredTypes = categoryFilter === "Tous" 
    ? activityTypes 
    : activityTypes.filter(a => a.category === categoryFilter);

  return (
    <div className={styles.container}>
      <Sidebar />
      
      <div className={styles.content} style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className={styles.heroSection}>
          <div>
            <h2 className={styles.heroTitle}>
              <i className="bi bi-activity me-3"></i>
              Suivi des Activités Physiques
            </h2>
            <p className={styles.heroSubtitle}>Enregistrez vos activités et suivez vos dépenses caloriques</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className={styles.statsCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className={`${styles.statsIconWrapper} ${styles.statsIconRed}`}>
                  <i className={`bi bi-fire ${styles.statsIcon}`}></i>
                </div>
                <div>
                  <p className={styles.statsLabel}>Calories brûlées</p>
                  <h3 className={`${styles.statsValue} ${styles.statsValueRed}`}>{Math.round(totalCaloriesBurned)}</h3>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className={styles.statsCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className={`${styles.statsIconWrapper} ${styles.statsIconBlue}`}>
                  <i className={`bi bi-clock ${styles.statsIcon}`}></i>
                </div>
                <div>
                  <p className={styles.statsLabel}>Temps total</p>
                  <h3 className={`${styles.statsValue} ${styles.statsValueBlue}`}>{totalDuration}</h3>
                </div>
              </div>
              <p className={styles.statsUnit}>minutes</p>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className={styles.statsCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className={`${styles.statsIconWrapper} ${styles.statsIconGreen}`}>
                  <i className={`bi bi-check-circle ${styles.statsIcon}`}></i>
                </div>
                <div>
                  <p className={styles.statsLabel}>Activités</p>
                  <h3 className={`${styles.statsValue} ${styles.statsValueGreen}`}>{activities.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire d'ajout */}
        <div style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '30px', 
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h4 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
            <i className="bi bi-plus-circle me-2" style={{ color: '#1ec287' }}></i>
            Ajouter une activité
          </h4>
          
          <form onSubmit={handleAddActivity}>
            <div className="row g-3">
              <div className="col-md-6">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Catégorie
                </label>
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{ padding: '10px', borderRadius: '10px', border: '2px solid #e0e0e0' }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Activité *
                </label>
                <select
                  className="form-select"
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  required
                  style={{ padding: '10px', borderRadius: '10px', border: '2px solid #e0e0e0' }}
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Durée (min) *
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="1"
                  required
                  style={{ padding: '10px', borderRadius: '10px', border: '2px solid #e0e0e0' }}
                />
              </div>

              <div className="col-md-3">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Poids (kg)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="30"
                  max="200"
                  step="0.1"
                  style={{ padding: '10px', borderRadius: '10px', border: '2px solid #e0e0e0' }}
                />
              </div>

              <div className="col-md-3">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ padding: '10px', borderRadius: '10px', border: '2px solid #e0e0e0' }}
                />
              </div>

              <div className="col-md-3">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  &nbsp;
                </label>
                <button
                  type="submit"
                  className="btn"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none'
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Ajout...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-lg me-2"></i>
                      Ajouter
                    </>
                  )}
                </button>
              </div>

              <div className="col-12">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Notes (optionnel)
                </label>
                <textarea
                  className="form-control"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="2"
                  placeholder="Ajoutez des notes sur votre activité..."
                  style={{ padding: '10px', borderRadius: '10px', border: '2px solid #e0e0e0' }}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Liste des activités */}
        <div style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h4 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
            <i className="bi bi-list-ul me-2" style={{ color: '#1ec287' }}></i>
            Historique des activités
          </h4>

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
                    <th>Calories brûlées</th>
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
                          fontSize: '14px'
                        }}>
                          <i className="bi bi-fire me-1"></i>
                          {Math.round(activity.calories_burned)} kcal
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
      </div>
    </div>
  );
}
