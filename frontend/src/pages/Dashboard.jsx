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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setToken(token);

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);

    getFoodEntries().then(res => {
      let entries = [];
      if (Array.isArray(res.data)) entries = res.data;
      else if (Array.isArray(res.data.entries)) entries = res.data.entries;
      else if (Array.isArray(res.data.data)) entries = res.data.data;
      setFoodEntries(entries);
    }).catch(err => {
      console.error("Erreur getFoodEntries :", err.response?.data || err.message);
    });

    refreshGoals();
  }, []);

  const fetchFoodsFromApi = async () => {
    try {
      setFoodsLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/foods', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : (res.data.foods || res.data.data || []);
      setFoods(data);
    } catch (err) {
      console.error("Erreur récupération aliments API :", err.response?.data || err.message);
    } finally {
      setFoodsLoading(false);
    }
  };

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
      
      // console.log('📤 Envoi payload vers /api/food-entries:', payload);
      
      const res = await axios.post('http://localhost:4000/api/food-entries', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // console.log('✅ Réponse backend:', res.data);
      
      // Recharger les entrées depuis le backend
      const entriesRes = await getFoodEntries();
      let entries = [];
      if (Array.isArray(entriesRes.data)) entries = entriesRes.data;
      else if (Array.isArray(entriesRes.data.entries)) entries = entriesRes.data.entries;
      else if (Array.isArray(entriesRes.data.data)) entries = entriesRes.data.data;
      
      // console.log('📊 Entrées reçues après ajout:', entries.length, 'aliments');
      setFoodEntries(entries);
      
      // Refresh goals after adding food
      refreshGoals();
      
      alert(`✅ ${payload.name} ajouté à votre suivi quotidien !\n📦 Quantité: ${payload.quantity || 100}g\n🔥 ${payload.calories} kcal`);
    } catch (err) {
      console.error("❌ Erreur ajout entrée alimentaire:", err);
      console.error("Détails:", err.response?.data);
      alert(`❌ Erreur: ${err.response?.data?.message || err.message || 'Impossible d\'ajouter l\'aliment'}`);
    }
  };

  const createNewFood = async (e) => {
    e.preventDefault();
    if (!newFood.name || !newFood.calories) {
      alert('⚠️ Nom et calories sont obligatoires');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: newFood.name,
        calories: Number(newFood.calories),
        proteins: Number(newFood.proteins) || 0,
        carbs: Number(newFood.carbs) || 0,
        fats: Number(newFood.fats) || 0,
        image: newFood.image || null
      };
      const res = await axios.post('http://localhost:4000/api/foods', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const created = res.data && (res.data.food || res.data.data || res.data);
      setFoods(prev => [created, ...prev]);
      setNewFood({ name: '', calories: '', proteins: '', carbs: '', fats: '', image: '' });
      setShowAddForm(false);
      alert('✅ Nouvel aliment créé avec succès !');
    } catch (err) {
      console.error("Erreur création aliment :", err.response?.data || err.message);
      alert('❌ Erreur lors de la création');
    }
  };

  const totalCalories = foodEntries.reduce((sum, f) => sum + (Number(f.calories) || 0), 0);
  const caloriesRestantes = objectif - totalCalories;
  const pct = objectif > 0 ? Math.min((totalCalories / objectif) * 100, 100) : 0;

  // Calcul moyennes pour stats
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

      <div className={styles.content}>
        <div className={styles.heroSection}>
          <div>
            <h2 className={styles.heroTitle}>Bienvenue, {username}</h2>
            <p className={styles.heroSubtitle}>Suivez vos calories et atteignez vos objectifs santé</p>
          </div>
          <button className={`btn btn-light ${styles.logoutBtn}`} onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>Déconnexion
          </button>
        </div>

        {/* Barre de recherche Open Food Facts */}
        <div style={{ marginBottom: '24px' }}>
          <button 
            className={`btn ${styles.loadBtn}`}
            onClick={() => setShowOpenFoodSearch(!showOpenFoodSearch)}
            style={{ 
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              marginBottom: showOpenFoodSearch ? '20px' : '0'
            }}
          >
            <i className={`bi ${showOpenFoodSearch ? 'bi-x-circle' : 'bi-search'} me-2`}></i>
            {showOpenFoodSearch ? 'Fermer la recherche' : 'Rechercher un aliment (Open Food Facts)'}
          </button>
          
          {showOpenFoodSearch && (
            <OpenFoodFactsSearch onFoodAdd={addFoodToEntries} />
          )}
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
                <CaloriesDonutChart caloriesRestantes={caloriesRestantes} objectif={objectif} entries={foodEntries} />
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

        <div className={styles.foodsCard}>
          <div className={styles.foodsHeader}>
            <h5 className={styles.foodsTitle}>
              <i className={`bi bi-basket me-2 ${styles.chartIcon}`}></i>Mes aliments
            </h5>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className={`btn btn-sm ${styles.loadBtn}`} 
                onClick={() => setShowAddForm(!showAddForm)}
                style={{ background: showAddForm ? '#16a970' : undefined }}
              >
                <i className={`bi ${showAddForm ? 'bi-x-lg' : 'bi-plus-circle'} me-2`}></i>
                {showAddForm ? 'Annuler' : 'Créer aliment'}
              </button>
              <button className={`btn btn-sm me-2 ${styles.loadBtn}`} onClick={fetchFoodsFromApi} disabled={foodsLoading}>
                {foodsLoading ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Chargement...</>
                ) : (
                  <><i className="bi bi-arrow-clockwise me-2"></i>Charger liste</>
                )}
              </button>
              {foods.length > 0 && (
                <button className={`btn btn-sm btn-outline-secondary ${styles.closeBtn}`} onClick={() => setFoods([])}>
                  <i className="bi bi-x-lg me-1"></i>Fermer
                </button>
              )}
            </div>
          </div>

          {/* Formulaire création aliment */}
          {showAddForm && (
            <form onSubmit={createNewFood} style={{
              background: 'linear-gradient(135deg, #e8f4f0 0%, #f0fdf4 100%)',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '24px',
              border: '2px solid #1ec287'
            }}>
              <h6 style={{ color: '#1ec287', fontWeight: 'bold', marginBottom: '16px' }}>
                <i className="bi bi-plus-square me-2"></i>Créer un nouvel aliment
              </h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px', display: 'block' }}>
                    Nom de l'aliment *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Poulet grillé"
                    value={newFood.name}
                    onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                    required
                    style={{ borderRadius: '10px', border: '2px solid #e0e0e0' }}
                  />
                </div>
                <div className="col-md-6">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px', display: 'block' }}>
                    Calories (kcal) *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Ex: 165"
                    value={newFood.calories}
                    onChange={(e) => setNewFood({...newFood, calories: e.target.value})}
                    required
                    style={{ borderRadius: '10px', border: '2px solid #e0e0e0' }}
                  />
                </div>
                <div className="col-md-4">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px', display: 'block' }}>
                    Protéines (g)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Ex: 31"
                    value={newFood.proteins}
                    onChange={(e) => setNewFood({...newFood, proteins: e.target.value})}
                    style={{ borderRadius: '10px', border: '2px solid #e0e0e0' }}
                  />
                </div>
                <div className="col-md-4">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px', display: 'block' }}>
                    Glucides (g)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Ex: 0"
                    value={newFood.carbs}
                    onChange={(e) => setNewFood({...newFood, carbs: e.target.value})}
                    style={{ borderRadius: '10px', border: '2px solid #e0e0e0' }}
                  />
                </div>
                <div className="col-md-4">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px', display: 'block' }}>
                    Lipides (g)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Ex: 3.6"
                    value={newFood.fats}
                    onChange={(e) => setNewFood({...newFood, fats: e.target.value})}
                    style={{ borderRadius: '10px', border: '2px solid #e0e0e0' }}
                  />
                </div>
                <div className="col-md-12">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px', display: 'block' }}>
                    URL de l'image (optionnel)
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://exemple.com/image.jpg"
                    value={newFood.image}
                    onChange={(e) => setNewFood({...newFood, image: e.target.value})}
                    style={{ borderRadius: '10px', border: '2px solid #e0e0e0' }}
                  />
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                <button 
                  type="submit" 
                  className={`btn ${styles.loadBtn}`}
                  style={{ padding: '10px 24px' }}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Créer et ajouter
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewFood({ name: '', calories: '', proteins: '', carbs: '', fats: '', image: '' });
                  }}
                  style={{ padding: '10px 24px', borderRadius: '10px' }}
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          {foods.length === 0 && !showAddForm ? (
            <div className={styles.emptyState}>
              <i className={`bi bi-inbox ${styles.emptyIcon}`}></i>
              <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '15px' }}>Aucun aliment disponible</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  className={`btn btn-sm ${styles.loadBtn}`}
                  onClick={() => setShowAddForm(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Créer un aliment
                </button>
                <span style={{ color: '#999', alignSelf: 'center' }}>ou</span>
                <button 
                  className={`btn btn-sm ${styles.loadBtn}`}
                  onClick={fetchFoodsFromApi}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Charger ma liste
                </button>
              </div>
            </div>
          ) : foods.length > 0 ? (
            <div className={styles.foodsList}>
              <div className="row g-3">
                {foods.map((f, idx) => (
                  <div key={f.id || idx} className="col-md-6">
                    <div className={styles.foodItem}>
                      {f.image ? (
                        <img src={f.image} alt={f.name} className={styles.foodImage} />
                      ) : (
                        <div className={styles.foodImagePlaceholder}>
                          <i className={`bi bi-image ${styles.foodImageIcon}`}></i>
                        </div>
                      )}
                      <div className={styles.foodInfo}>
                        <h6 className={styles.foodName}>{f.name ?? f.nom ?? f.title}</h6>
                        <p className={styles.foodCalories}>{f.calories ?? f.kcal ?? "-"} kcal</p>
                      </div>
                      <button className={`btn btn-sm ${styles.addBtn}`} onClick={() => addFoodToEntries(f)}>
                        <i className="bi bi-plus-lg me-1"></i>Ajouter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
