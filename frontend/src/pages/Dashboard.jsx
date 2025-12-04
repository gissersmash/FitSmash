// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from 'axios';
import { getFoodEntries } from '../services/foodEntryService';
import { setToken } from "../services/api";
import Sidebar from '../components/Sidebar';
import CaloriesDonutChart from '../components/CaloriesDonutChart';
import { ProgressBar } from "react-bootstrap";  
import WeeklyCaloriesChart from "../components/WeeklyCaloriesChart";
import OpenFoodFactsSearch from '../components/OpenFoodFactsSearch';
import DashboardSidebar from '../components/DashboardSidebar';
import FoodManagement from '../components/FoodManagement';
import { showNotification } from '../utils/notifications';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  const isAuthenticated = !!localStorage.getItem('token');
  const [foodEntries, setFoodEntries] = useState([]);
  const [allGoals, setAllGoals] = useState([]);
  const [objectif, setObjectif] = useState(0);
  const [foods, setFoods] = useState([]);
  const [foodsLoading, setFoodsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showOpenFoodSearch, setShowOpenFoodSearch] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', calories: '', proteins: '', carbs: '', fats: '', image: '' });
  const navigate = useNavigate();

  const refreshGoals = () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:4000/api/goals', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const goals = Array.isArray(res.data) ? res.data : Array.isArray(res.data.goals) ? res.data.goals : Array.isArray(res.data.data) ? res.data.data : [];
      setAllGoals(goals);
      const goal = goals.find(g => g.type && g.type.toLowerCase() === 'calories');
      if (goal) setObjectif(goal.value);
    }).catch(err => {
      console.error("Erreur récupération objectifs :", err.response?.data || err.message);
    });
  };

  const refreshFoodEntries = async () => {
    try {
      const res = await getFoodEntries();
      let entries = [];
      if (Array.isArray(res.data)) entries = res.data;
      else if (Array.isArray(res.data.entries)) entries = res.data.entries;
      else if (Array.isArray(res.data.data)) entries = res.data.data;
      setFoodEntries(entries);
    } catch (err) {
      // Erreur silencieuse
    }
  };

  const handleDeleteEntry = async (entry) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/food-entries/${entry.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshFoodEntries();
      refreshGoals();
      showNotification('success', `"${entry.name || entry.foodName}" supprimé avec succès`);
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Impossible de supprimer');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setToken(token);
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
    refreshFoodEntries();
    refreshGoals();
  }, []);

  const addFoodToEntries = async (food) => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        food_id: food.id ?? null,
        name: food.name ?? food.nom ?? food.title ?? "Aliment",
        calories: Number(food.calories || food.calorie || food.kcal || 0),
        proteins: Number(food.proteins || food.proteines || 0),
        carbs: Number(food.carbs || food.glucides || 0),
        fats: Number(food.fats || food.lipides || 0),
        image: food.image || null,
        date: new Date().toISOString().split('T')[0]
      };
      await axios.post('http://localhost:4000/api/food-entries', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshFoodEntries();
      refreshGoals();
      showNotification('success', `${payload.name} ajouté !`, `${payload.quantity || 100}g • ${payload.calories} kcal`);
    } catch (err) {
      showNotification('error', err.response?.data?.message || err.message || 'Impossible d\'ajouter');
    }
  };

  const totalCalories = foodEntries.reduce((sum, f) => sum + (Number(f.calories) || 0), 0);
  const caloriesRestantes = objectif - totalCalories;
  const pct = objectif > 0 ? Math.min((totalCalories / objectif) * 100, 100) : 0;
  const avgCaloriesPerDay = foodEntries.length > 0 
    ? Math.round(totalCalories / Math.max(1, new Set(foodEntries.map(e => e.date)).size))
    : 0;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className={styles.container}>
      <Sidebar />

      <div style={{ display: 'flex', flexGrow: 1, gap: '32px', alignItems: 'flex-start' }}>
        <div className={styles.content} style={{ flex: '1 1 65%', maxWidth: 'none' }}>
          <div className={styles.heroSection}>
            <div>
              <h2 className={styles.heroTitle}>Bienvenue, {username}</h2>
              <p className={styles.heroSubtitle}>Suivez vos calories et atteignez vos objectifs santé</p>
            </div>
            <button className={`btn btn-light ${styles.logoutBtn}`} onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>Déconnexion
            </button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <button 
              className={`btn ${styles.loadBtn}`}
              onClick={() => setShowOpenFoodSearch(!showOpenFoodSearch)}
              style={{ width: '100%', padding: '16px', fontSize: '16px', marginBottom: showOpenFoodSearch ? '20px' : '0' }}
            >
              <i className={`bi ${showOpenFoodSearch ? 'bi-x-circle' : 'bi-search'} me-2`}></i>
              {showOpenFoodSearch ? 'Fermer la recherche' : 'Catalogue des aliments'}
            </button>
            {showOpenFoodSearch && <OpenFoodFactsSearch onFoodAdd={addFoodToEntries} />}
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className={styles.statsCard}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <div className={`${styles.statsIconWrapper} ${styles.statsIconGreen}`}>
                    <i className={`bi bi-bullseye ${styles.statsIcon}`}></i>
                  </div>
                  <div>
                    <p className={styles.statsLabel}>Objectif</p>
                    <h3 className={`${styles.statsValue} ${styles.statsValueGreen}`}>{objectif || "-"}</h3>
                  </div>
                </div>
                <p className={styles.statsUnit}>kcal / jour</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className={styles.statsCard}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <div className={`${styles.statsIconWrapper} ${styles.statsIconBlue}`}>
                    <i className={`bi bi-fire ${styles.statsIcon}`}></i>
                  </div>
                  <div>
                    <p className={styles.statsLabel}>Consommé</p>
                    <h3 className={`${styles.statsValue} ${styles.statsValueBlue}`}>{totalCalories}</h3>
                  </div>
                </div>
                <p className={styles.statsUnit}>kcal aujourd'hui</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className={styles.statsCard}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <div className={`${styles.statsIconWrapper} ${caloriesRestantes < 0 ? styles.statsIconRed : styles.statsIconSuccess}`}>
                    <i className={`bi ${caloriesRestantes < 0 ? 'bi-exclamation-triangle' : 'bi-check-circle'} ${styles.statsIcon}`}></i>
                  </div>
                  <div>
                    <p className={styles.statsLabel}>Restant</p>
                    <h3 className={`${styles.statsValue} ${caloriesRestantes < 0 ? styles.statsValueRed : styles.statsValueSuccess}`}>
                      {caloriesRestantes}
                    </h3>
                  </div>
                </div>
                <p className={styles.statsUnit}>{caloriesRestantes < 0 ? 'Objectif dépassé' : 'kcal restantes'}</p>
              </div>
            </div>
          </div>

          <div className={styles.progressCard}>
            <div className={styles.progressHeader}>
              <h5 className={styles.progressTitle}>Progression du jour</h5>
              <span className={`${styles.progressBadge} ${pct >= 100 ? styles.progressBadgeDanger : styles.progressBadgeSuccess}`}>
                {Math.round(pct)}%
              </span>
            </div>
            <ProgressBar now={pct} style={{ height: 12, borderRadius: 6 }} variant={pct >= 100 ? 'danger' : 'success'} />
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className={styles.chartCard}>
                <h5 className={styles.chartTitle}>
                  <i className={`bi bi-pie-chart-fill me-2 ${styles.chartIcon}`}></i>
                  Répartition calories
                </h5>
                <div className={styles.chartWrapper}>
                  <CaloriesDonutChart 
                    caloriesRestantes={caloriesRestantes} 
                    objectif={objectif} 
                    entries={foodEntries}
                    onDeleteEntry={handleDeleteEntry}
                  />
                </div>
                <div className={styles.chartStats}>
                  <div className={styles.chartStatItem}>
                    <div className={styles.chartStatLabel}>Total consommé</div>
                    <div className={styles.chartStatValue}>{totalCalories}</div>
                  </div>
                  <div className={styles.chartStatItem}>
                    <div className={styles.chartStatLabel}>Objectif</div>
                    <div className={styles.chartStatValue}>{objectif || "-"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className={styles.chartCard}>
                <h5 className={styles.chartTitle}>
                  <i className={`bi bi-graph-up-arrow me-2 ${styles.chartIcon}`}></i>
                  Évolution 7 derniers jours
                </h5>
                <div className={styles.chartWrapper}>
                  <WeeklyCaloriesChart entries={foodEntries} />
                </div>
                <div className={styles.chartStats}>
                  <div className={styles.chartStatItem}>
                    <div className={styles.chartStatLabel}>Moyenne / jour</div>
                    <div className={styles.chartStatValue}>{avgCaloriesPerDay}</div>
                  </div>
                  <div className={styles.chartStatItem}>
                    <div className={styles.chartStatLabel}>Total entrées</div>
                    <div className={styles.chartStatValue}>{foodEntries.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FoodManagement 
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            newFood={newFood}
            setNewFood={setNewFood}
            foods={foods}
            setFoods={setFoods}
            foodsLoading={foodsLoading}
            setFoodsLoading={setFoodsLoading}
            onFoodAdd={addFoodToEntries}
            styles={styles}
          />
        </div>

        <DashboardSidebar 
          totalCalories={totalCalories}
          objectif={objectif}
          foodEntriesCount={foodEntries.length}
          pct={pct}
        />
      </div>
    </div>
  );
}
