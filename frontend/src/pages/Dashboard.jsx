// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from 'axios';
import { getFoodEntries } from '../services/foodEntryService';
import { useTranslation } from '../hooks/useTranslation';
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
  const { t } = useTranslation();
  const isAuthenticated = !!localStorage.getItem('token');
  const [foodEntries, setFoodEntries] = useState([]);
  const [objectif, setObjectif] = useState(0);
  const [foods, setFoods] = useState([]);
  const [foodsLoading, setFoodsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showOpenFoodSearch, setShowOpenFoodSearch] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', calories: '', proteins: '', carbs: '', fats: '', image: '' });
  const [showCalorieAlert, setShowCalorieAlert] = useState(false);
  const [calorieOverage, setCalorieOverage] = useState(0);
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  const refreshGoals = () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:4000/api/goals', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const goals = Array.isArray(res.data) ? res.data : Array.isArray(res.data.goals) ? res.data.goals : Array.isArray(res.data.data) ? res.data.data : [];
      const goal = goals.find(g => g.type && g.type.toLowerCase() === 'calories');
      if (goal) setObjectif(goal.value);
    }).catch(() => {
      // Erreur silencieuse
    });
  };

  const refreshFoodEntries = async () => {
    try {
      const res = await getFoodEntries();
      let entries = [];
      if (Array.isArray(res.data)) entries = res.data;
      else if (Array.isArray(res.data.entries)) entries = res.data.entries;
      else if (Array.isArray(res.data.data)) entries = res.data.data;
      
      // Filtrer uniquement les entrées du jour actuel
      const today = new Date().toISOString().split('T')[0];
      const todayEntries = entries.filter(entry => {
        const entryDate = entry.date ? entry.date.split('T')[0] : null;
        return entryDate === today;
      });
      
      setFoodEntries(todayEntries);
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
      showNotification('success', `"${entry.name || entry.foodName}" ${t('food.deleted')}`);
    } catch (err) {
      showNotification('error', err.response?.data?.message || t('food.errorDeleting'));
    }
  };

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get("http://localhost:4000/api/activities", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filtrer les activités du jour
      const today = new Date().toISOString().split('T')[0];
      const todayActivities = (res.data.activities || []).filter(a => 
        a.date && a.date.split('T')[0] === today
      );
      setActivities(todayActivities);
    } catch (err) {
      // Erreur silencieuse
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setToken(token);
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
    refreshFoodEntries();
    refreshGoals();
    fetchActivities();
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
      showNotification('success', `${payload.name} ${t('food.added')}`, `${payload.quantity || 100}g • ${payload.calories} kcal`);
      
      // Vérifier si l'objectif est dépassé (en tenant compte des activités)
      const newTotalCalories = totalCalories + payload.calories;
      const caloriesBurned = activities.reduce((sum, a) => sum + (a.calories_burned || 0), 0);
      const netCalories = newTotalCalories - caloriesBurned;
      
      if (objectif > 0 && netCalories > objectif) {
        setCalorieOverage(netCalories - objectif);
        setShowCalorieAlert(true);
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || err.message || t('food.errorAdding'));
    }
  };

  const totalCalories = foodEntries.reduce((sum, f) => sum + (Number(f.calories) || 0), 0);
  const totalProteins = foodEntries.reduce((sum, f) => sum + (Number(f.proteins) || 0), 0);
  const totalCarbs = foodEntries.reduce((sum, f) => sum + (Number(f.carbs) || 0), 0);
  const totalFats = foodEntries.reduce((sum, f) => sum + (Number(f.fats) || 0), 0);
  const caloriesBurned = activities.reduce((sum, a) => sum + (a.calories_burned || 0), 0);
  const netCalories = totalCalories - caloriesBurned;
  const caloriesRestantes = objectif - netCalories;
  const pct = objectif > 0 ? Math.min((netCalories / objectif) * 100, 100) : 0;
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
              <p className={styles.heroSubtitle}>
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                <span style={{ margin: '0 12px', opacity: 0.5 }}>•</span>
                Suivez vos calories et atteignez vos objectifs santé
              </p>
            </div>
            <button className={`btn btn-light ${styles.logoutBtn}`} onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>Déconnexion
            </button>
          </div>

          {/* Info activités physiques */}
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-activity" style={{ fontSize: '28px' }}></i>
              </div>
              <div>
                <h5 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                  Nouveau : Suivez vos activités physiques !
                </h5>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                  Enregistrez vos sports et calculez automatiquement les calories brûlées
                </p>
              </div>
            </div>
            <a
              href="/tableau-suivi"
              style={{
                background: 'white',
                color: '#2563eb',
                padding: '10px 20px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Découvrir
              <i className="bi bi-arrow-right"></i>
            </a>
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
                  <div className={`${styles.statsIconWrapper} ${styles.statsIconOrange}`}>
                    <i className={`bi bi-lightning-charge ${styles.statsIcon}`}></i>
                  </div>
                  <div>
                    <p className={styles.statsLabel}>Brûlé</p>
                    <h3 className={`${styles.statsValue} ${styles.statsValueOrange}`}>{Math.round(caloriesBurned)}</h3>
                  </div>
                </div>
                <p className={styles.statsUnit}>kcal d'activités</p>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-12">
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
              <span className={`${styles.progressBadge} ${caloriesRestantes <= 0 ? styles.progressBadgeDanger : styles.progressBadgeSuccess}`}>
                {caloriesRestantes > 0 ? `${Math.round(caloriesRestantes)} kcal restantes` : `Objectif atteint`}
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
          caloriesRestantes={caloriesRestantes}
          caloriesBurned={caloriesBurned}
          netCalories={netCalories}
          totalProteins={totalProteins}
          totalCarbs={totalCarbs}
          totalFats={totalFats}
        />
      </div>

      {/* Modal d'alerte dépassement calories */}
      {showCalorieAlert && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.3s'
          }}
          onClick={() => setShowCalorieAlert(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '480px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'slideDown 0.4s ease-out',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)',
                  animation: 'pulse 2s infinite'
                }}
              >
                <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '48px', color: 'white' }}></i>
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#dc2626', marginBottom: '10px' }}>
                Objectif dépassé !
              </h2>
              <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
                Vous avez dépassé votre objectif calorique quotidien de <strong style={{ color: '#dc2626' }}>{calorieOverage} kcal</strong>
              </p>
              <div style={{
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                border: '2px solid #fca5a5',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '15px', color: '#991b1b', fontWeight: '600' }}>
                    <i className="bi bi-bullseye me-2"></i>Objectif
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc2626' }}>{objectif} kcal</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', color: '#991b1b', fontWeight: '600' }}>
                    <i className="bi bi-fire me-2"></i>Consommé
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc2626' }}>{totalCalories + calorieOverage} kcal</span>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic', marginTop: '16px' }}>
                💡 Conseil : Pratiquez une activité physique pour compenser ou ajustez vos prochains repas
              </p>
            </div>

            <button
              onClick={() => setShowCalorieAlert(false)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                fontWeight: 'bold',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.4)';
              }}
            >
              <i className="bi bi-check-circle me-2"></i>
              J'ai compris
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 12px 32px rgba(239, 68, 68, 0.6);
          }
        }
      `}</style>
    </div>
  );
}
