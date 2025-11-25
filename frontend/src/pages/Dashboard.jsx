// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from 'axios';
import { getFoodEntries } from '../services/foodEntryService';
import { setToken } from "../services/api";
import Sidebar from '../components/Sidebar';
import CaloriesDonutChart from '../components/CaloriesDonutChart';
import { ProgressBar, Carousel } from "react-bootstrap";  
import WeeklyCaloriesChart from "../components/WeeklyCaloriesChart";

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
      const goal = res.data.find(g => g.type.toLowerCase() === 'calories');
      if (goal) setObjectif(parseInt(goal.value, 10));
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setToken(token);

    getFoodEntries().then(res => {
      let entries = [];
      if (Array.isArray(res.data)) entries = res.data;
      else if (Array.isArray(res.data.entries)) entries = res.data.entries;
      else if (Array.isArray(res.data.data)) entries = res.data.data;
      setFoodEntries(entries);
    });

    refreshGoals();
  }, []);

  const totalCalories = foodEntries.reduce((sum, f) => sum + (f.calories || 0), 0);
  const caloriesRestantes = objectif - totalCalories;
  const pct = objectif > 0 ? Math.min((totalCalories / objectif) * 100, 100) : 0;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBEA' }}>
      <Sidebar />

      <div className="container d-flex flex-column align-items-center" style={{ maxWidth: 1000, marginTop: 40 }}>

        {/* ✅ Slider Bien-être automatique */}
        <Carousel fade interval={3000} controls={false} indicators={false} className="mb-4 w-100 shadow rounded">
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/images/image1.jpg"
              alt="Santé et bien-être"
              style={{ height: 400, objectFit: "cover", borderRadius: "12px" }}
            />
            <Carousel.Caption style={{ backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "8px", padding: "10px" }}>
              <h5 style={{ color: "#fff" }}>Bien-être au quotidien </h5>
              <p style={{ color: "#ddd" }}>Adoptez une alimentation équilibrée pour rester en forme.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/images/image2.jpg"
              alt="Sport"
              style={{ height: 400, objectFit: "cover", borderRadius: "12px" }}
            />
            <Carousel.Caption style={{ backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "8px", padding: "10px" }}>
              <h5 style={{ color: "#fff" }}>Bougez chaque jour </h5>
              <p style={{ color: "#ddd" }}>L’activité physique est la clé d’une vie saine.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/images/image3.jpg"
              alt="Sommeil et récupération"
              style={{ height: 400, objectFit: "cover", borderRadius: "12px" }}
            />
            <Carousel.Caption style={{ backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "8px", padding: "10px" }}>
              <h5 style={{ color: "#fff" }}>Un esprit sain </h5>
              <p style={{ color: "#ddd" }}>Le repos et la sérénité renforcent la santé.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>

        {/* ✅ Carte principale */}
        <div className="card shadow-lg p-4 mb-5 w-100">
          <h3 className="mb-4 text-center" style={{ color: '#1ec287', fontWeight: 'bold' }}>
            <i className="bi bi-pie-chart me-2"></i>
            Dashboard Nutrition
          </h3>

          {/* ✅ Progression calories */}
          <h5>Progression calories</h5>
          <ProgressBar now={pct} label={`${Math.round(pct)}%`} className="mb-3" />

          {/* ✅ Résumé rapide */}
          <div className="d-flex justify-content-around mb-4">
            <div className="card p-3 shadow-sm text-center">
              <h6>Objectif</h6>
              <strong>{objectif || "-"} kcal</strong>
            </div>
            <div className="card p-3 shadow-sm text-center">
              <h6>Consommé</h6>
              <strong>{totalCalories} kcal</strong>
            </div>
            <div className="card p-3 shadow-sm text-center">
              <h6>Restant</h6>
              <strong className={caloriesRestantes < 0 ? "text-danger" : "text-success"}>
                {caloriesRestantes} kcal
              </strong>
            </div>
          </div>

          {/* ✅ Graphique Donut */}
          <CaloriesDonutChart caloriesRestantes={caloriesRestantes} objectif={objectif} entries={foodEntries} />
        </div>

        {/* ✅ Nouveau graphique hebdo */}
        <div className="card shadow-lg p-4 mb-5 w-100">
          <h4 className="mb-3 text-center">Évolution des calories (7 jours)</h4>
          <WeeklyCaloriesChart entries={foodEntries} />
        </div>
      </div>
    </div>
  );
}
