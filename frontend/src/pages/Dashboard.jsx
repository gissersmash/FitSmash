// Dashboard.jsx
import { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import HealthForm from "../components/HealthForm";
import HealthTable from "../components/HealthTable";
import HealthChart from "../components/HealthChart";
import CaloriesDonutChart from '../components/CaloriesDonutChart';
import axios from 'axios';
import { getFoodEntries } from '../services/foodEntryService';
import { getHealthEntries, deleteHealthEntry } from "../services/healthService";
import { setToken } from "../services/api";
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const isAuthenticated = !!localStorage.getItem('token');
  const [foodEntries, setFoodEntries] = useState([]);
  const [objectif, setObjectif] = useState(0);

  // Fonction pour rafraîchir l'objectif
  const refreshGoals = () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:4000/api/goals', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const goal = res.data.find(g => g.type === 'calories');
      if (goal) setObjectif(goal.value);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setToken(token);
    // Récupère les aliments enregistrés (food entries)
    getFoodEntries().then(res => {
      let entries = [];
      if (Array.isArray(res.data)) entries = res.data;
      else if (Array.isArray(res.data.entries)) entries = res.data.entries;
      else if (Array.isArray(res.data.data)) entries = res.data.data;
      setFoodEntries(entries);
    });
    // Récupère l’objectif au chargement
    refreshGoals();
  }, []);

  const totalCalories = foodEntries.reduce((sum, f) => sum + (f.calories || 0), 0);
  const caloriesRestantes = objectif - totalCalories;

  if (!isAuthenticated) return <Navigate to="/login" />;

  // Passe la fonction refreshGoals en props si besoin à un composant enfant
  return (
    <div style={{ minHeight: '100vh', background: '#FFFBEA' }}>
      <Sidebar />
      <div className="container py-4">
  <CaloriesDonutChart caloriesRestantes={caloriesRestantes} objectif={objectif} entries={foodEntries} />
        {/* Pour rafraîchir l'objectif après modification, appelle refreshGoals() après POST/PUT sur /api/goals */}
      </div>
    </div>
  );
}
