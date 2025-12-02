# Guide d'Intégration Frontend - API FitSmash

## Vue d'ensemble

Ce guide explique comment intégrer l'API FitSmash dans ton application React pour :
1. Charger les aliments disponibles
2. Ajouter des aliments au journal alimentaire
3. Afficher les calories consommées et restantes
4. Gérer l'objectif calorique

---

## 1. Configuration de base

### Service API (axios)

Créer un fichier `src/services/api.js` :

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// Créer une instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
export { API_URL };
```

---

## 2. Charger les Aliments Disponibles

### Service des aliments

Créer `src/services/foodService.js` :

```javascript
import api from './api';

// Récupérer tous les aliments (publics + personnels)
export const getAllFoods = async () => {
  const response = await api.get('/foods');
  return response.data;
};

// Récupérer tous les aliments (publics uniquement, sans auth)
export const getPublicFoods = async () => {
  const response = await api.get('/foods/all');
  return response.data;
};

// Ajouter un aliment personnalisé
export const createFood = async (foodData) => {
  const response = await api.post('/foods', foodData);
  return response.data;
};

// Supprimer un aliment
export const deleteFood = async (id) => {
  const response = await api.delete(`/foods/${id}`);
  return response.data;
};
```

### Utilisation dans un composant React

```javascript
import { useState, useEffect } from 'react';
import { getAllFoods } from '../services/foodService';

function FoodList() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFoods = async () => {
    setLoading(true);
    try {
      const data = await getAllFoods();
      setFoods(data);
    } catch (error) {
      console.error('Erreur chargement aliments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="food-grid">
          {foods.map(food => (
            <div key={food.id} className="food-card">
              <h4>{food.name}</h4>
              <p>{food.calories} kcal</p>
              <button onClick={() => handleAddFood(food)}>
                Ajouter
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 3. Ajouter des Aliments au Journal

### Service des entrées alimentaires

Créer `src/services/foodEntryService.js` :

```javascript
import api from './api';

// Récupérer les entrées alimentaires + calories restantes
export const getFoodEntries = async () => {
  const response = await api.get('/food-entries');
  return response.data;
};

// Ajouter une entrée alimentaire
export const addFoodEntry = async (entryData) => {
  const response = await api.post('/food-entries', entryData);
  return response.data;
};

// Supprimer une entrée alimentaire
export const deleteFoodEntry = async (id) => {
  const response = await api.delete(`/food-entries/${id}`);
  return response.data;
};
```

### Exemple d'ajout d'un aliment

```javascript
import { addFoodEntry } from '../services/foodEntryService';

const handleAddFood = async (food) => {
  try {
    const entry = {
      food_id: food.id,
      name: food.name,
      calories: food.calories,
      image: food.image_url || null,
      date: new Date().toISOString()
    };
    
    await addFoodEntry(entry);
    
    // Rafraîchir la liste
    await refreshEntries();
    
    alert(`${food.name} ajouté avec succès !`);
  } catch (error) {
    console.error('Erreur ajout aliment:', error);
    alert('Erreur lors de l\'ajout');
  }
};
```

---

## 4. Afficher les Calories Restantes

### Composant Dashboard avec calcul des calories

```javascript
import { useState, useEffect } from 'react';
import { getFoodEntries } from '../services/foodEntryService';

function Dashboard() {
  const [data, setData] = useState({
    entries: [],
    totalCalories: 0,
    objectif: 2000,
    caloriesRestantes: 2000,
    pourcentage: 0
  });

  const refreshData = async () => {
    try {
      const response = await getFoodEntries();
      setData(response);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="dashboard">
      <h2>Tableau de bord</h2>
      
      {/* Cartes de statistiques */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Objectif</h3>
          <p className="value">{data.objectif} kcal</p>
        </div>
        
        <div className="stat-card">
          <h3>Consommé</h3>
          <p className="value">{data.totalCalories} kcal</p>
        </div>
        
        <div className="stat-card">
          <h3>Restant</h3>
          <p className={`value ${data.caloriesRestantes < 0 ? 'negative' : ''}`}>
            {data.caloriesRestantes} kcal
          </p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="progress-section">
        <h3>Progression du jour</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${Math.min(data.pourcentage, 100)}%`,
              backgroundColor: data.pourcentage > 100 ? '#e74c3c' : '#2ecc71'
            }}
          />
        </div>
        <p>{data.pourcentage}% de l'objectif atteint</p>
      </div>

      {/* Liste des entrées */}
      <div className="entries-list">
        <h3>Mes aliments du jour</h3>
        {data.entries.length === 0 ? (
          <p>Aucun aliment ajouté aujourd'hui</p>
        ) : (
          <ul>
            {data.entries.map(entry => (
              <li key={entry.id}>
                <span>{entry.name}</span>
                <span>{entry.calories} kcal</span>
                <button onClick={() => handleDeleteEntry(entry.id)}>
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  async function handleDeleteEntry(id) {
    try {
      await deleteFoodEntry(id);
      await refreshData();
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  }
}

export default Dashboard;
```

---

## 5. Gérer l'Objectif Calorique

### Service des objectifs

Créer `src/services/goalService.js` :

```javascript
import api from './api';

// Récupérer les objectifs
export const getGoals = async () => {
  const response = await api.get('/goals');
  return response.data;
};

// Créer/Mettre à jour les objectifs
export const updateGoals = async (goalsData) => {
  const response = await api.post('/goals', goalsData);
  return response.data;
};
```

### Formulaire de modification de l'objectif

```javascript
import { useState } from 'react';
import { updateGoals } from '../services/goalService';

function GoalForm({ currentGoal, onUpdate }) {
  const [calorieGoal, setCalorieGoal] = useState(currentGoal || 2000);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateGoals({
        Calories: calorieGoal,
        Protéines: 0,
        Glucides: 0,
        Lipides: 0
      });
      
      alert('Objectif mis à jour !');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Erreur mise à jour objectif:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Objectif calorique quotidien :
        <input
          type="number"
          value={calorieGoal}
          onChange={(e) => setCalorieGoal(Number(e.target.value))}
          min="1000"
          max="5000"
          step="100"
        />
        kcal/jour
      </label>
      <button type="submit">Enregistrer</button>
    </form>
  );
}
```

---

## 6. Flux Complet d'Utilisation

### 1. **Chargement initial**
```javascript
useEffect(() => {
  // Charger les aliments disponibles
  loadFoods();
  
  // Charger les entrées + calcul calories
  loadEntries();
  
  // Charger l'objectif
  loadGoals();
}, []);
```

### 2. **Ajout d'un aliment**
```
Client clique "Ajouter" sur un aliment
  ↓
Envoi POST /api/food-entries
  ↓
Backend enregistre l'entrée
  ↓
Client rafraîchit GET /api/food-entries
  ↓
Affiche nouveau total + calories restantes
```

### 3. **Calcul des calories restantes** (fait par le backend)
```javascript
// Backend calcule automatiquement :
caloriesRestantes = objectif - totalCalories

// Retourné dans GET /api/food-entries
{
  entries: [...],
  totalCalories: 1500,
  objectif: 2000,
  caloriesRestantes: 500,
  pourcentage: 75
}
```

---

## 7. Exemple de Composant Complet

```javascript
import { useState, useEffect } from 'react';
import { getAllFoods } from '../services/foodService';
import { getFoodEntries, addFoodEntry, deleteFoodEntry } from '../services/foodEntryService';

function NutritionTracker() {
  const [foods, setFoods] = useState([]);
  const [data, setData] = useState({
    entries: [],
    totalCalories: 0,
    objectif: 2000,
    caloriesRestantes: 2000,
    pourcentage: 0
  });
  const [loading, setLoading] = useState(false);

  // Charger aliments disponibles
  useEffect(() => {
    loadFoods();
    refreshData();
  }, []);

  const loadFoods = async () => {
    try {
      const foodsData = await getAllFoods();
      setFoods(foodsData);
    } catch (error) {
      console.error('Erreur chargement aliments:', error);
    }
  };

  const refreshData = async () => {
    try {
      const response = await getFoodEntries();
      setData(response);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
  };

  const handleAddFood = async (food) => {
    setLoading(true);
    try {
      await addFoodEntry({
        food_id: food.id,
        name: food.name,
        calories: food.calories,
        image: food.image_url || null,
        date: new Date().toISOString()
      });
      
      await refreshData();
      alert(`${food.name} ajouté !`);
    } catch (error) {
      console.error('Erreur ajout:', error);
      alert('Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await deleteFoodEntry(id);
      await refreshData();
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  return (
    <div className="nutrition-tracker">
      {/* Section résumé */}
      <div className="summary">
        <div className="stat">
          <h3>Objectif</h3>
          <p>{data.objectif} kcal</p>
        </div>
        <div className="stat">
          <h3>Consommé</h3>
          <p>{data.totalCalories} kcal</p>
        </div>
        <div className="stat">
          <h3>Restant</h3>
          <p className={data.caloriesRestantes < 0 ? 'text-red' : 'text-green'}>
            {data.caloriesRestantes} kcal
          </p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="progress">
        <div 
          className="bar" 
          style={{ 
            width: `${Math.min(data.pourcentage, 100)}%`,
            background: data.pourcentage > 100 ? 'red' : 'green'
          }}
        />
        <span>{data.pourcentage}%</span>
      </div>

      {/* Liste des aliments disponibles */}
      <div className="food-list">
        <h2>Aliments disponibles</h2>
        <div className="grid">
          {foods.map(food => (
            <div key={food.id} className="food-card">
              {food.image_url && <img src={food.image_url} alt={food.name} />}
              <h4>{food.name}</h4>
              <p>{food.calories} kcal</p>
              <button 
                onClick={() => handleAddFood(food)}
                disabled={loading}
              >
                + Ajouter
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Journal alimentaire */}
      <div className="entries">
        <h2>Mon journal du jour</h2>
        {data.entries.length === 0 ? (
          <p>Aucun aliment ajouté</p>
        ) : (
          <ul>
            {data.entries.map(entry => (
              <li key={entry.id}>
                <span>{entry.name}</span>
                <span>{entry.calories} kcal</span>
                <button onClick={() => handleDeleteEntry(entry.id)}>
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NutritionTracker;
```

---

## 8. CSS de Base

```css
.summary {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat {
  flex: 1;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
}

.stat h3 {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.stat p {
  margin: 10px 0 0;
  font-size: 24px;
  font-weight: bold;
}

.text-red { color: #e74c3c; }
.text-green { color: #2ecc71; }

.progress {
  height: 30px;
  background: #eee;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 30px;
  position: relative;
}

.progress .bar {
  height: 100%;
  transition: width 0.3s ease;
}

.progress span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  color: #333;
}

.food-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.food-card {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
}

.food-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
}

.food-card button {
  width: 100%;
  padding: 10px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.food-card button:hover {
  background: #27ae60;
}

.food-card button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}
```

---

## 9. Résumé des Endpoints API

| Méthode | Endpoint | Description | Retour |
|---------|----------|-------------|--------|
| GET | `/api/foods` | Liste aliments (perso + publics) | `[{ id, name, calories, ... }]` |
| GET | `/api/foods/all` | Liste aliments publics (sans auth) | `[{ id, name, calories, ... }]` |
| POST | `/api/food-entries` | Ajouter une entrée | `{ entry: {...} }` |
| GET | `/api/food-entries` | Liste entrées + calcul calories | `{ entries, totalCalories, objectif, caloriesRestantes, pourcentage }` |
| DELETE | `/api/food-entries/:id` | Supprimer une entrée | `{ message }` |
| GET | `/api/goals` | Liste objectifs | `[{ type, value }]` |
| POST | `/api/goals` | Mettre à jour objectifs | `{ message }` |

---

✅ **Ton frontend est maintenant prêt à communiquer avec l'API !**

Tu peux :
1. Charger les 25 aliments de base
2. Ajouter des aliments au journal
3. Voir en temps réel les calories consommées
4. Calculer les calories restantes
5. Gérer l'objectif calorique
