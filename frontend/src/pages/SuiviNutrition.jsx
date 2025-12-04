import React, { useState, useEffect } from "react";
import FoodTracker from "../components/FoodTracker";
import FoodSearch from "../components/FoodSearch";
import Sidebar from "../components/Sidebar";
import { getFoodEntries } from "../services/foodEntryService";

export default function SuiviNutrition() {
  const [foodEntries, setFoodEntries] = useState([]);

  const refreshFoodEntries = () => {
    getFoodEntries().then(res => {
      let entries = [];
      if (Array.isArray(res.data)) entries = res.data;
      else if (Array.isArray(res.data.entries)) entries = res.data.entries;
      else if (Array.isArray(res.data.data)) entries = res.data.data;
      setFoodEntries(entries);
    }).catch(err => {
      // Erreur silencieuse
    });
  };

  useEffect(() => {
    refreshFoodEntries();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBEA' }}>
      <Sidebar />
      <div className="container py-4">
        <h5 className="mb-3" style={{ color: "#1ec287" }}>Suivi nutrition</h5>
        
        {/* Section recherche et ajout d'aliments */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
        }}>
          <h5 style={{ color: '#1ec287', marginBottom: '20px', fontWeight: '600' }}>
            <i className="bi bi-search me-2"></i>
            Catalogue des aliments
          </h5>
          <FoodSearch onFoodAdded={refreshFoodEntries} />
        </div>

        <FoodTracker />
      </div>
    </div>
  );
}
