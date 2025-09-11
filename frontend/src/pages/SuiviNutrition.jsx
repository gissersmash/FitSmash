import React from "react";
import FoodTracker from "../components/FoodTracker";
import Sidebar from "../components/Sidebar";

export default function SuiviNutrition() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFFBEA' }}>
      <Sidebar />
      <div className="container py-4">
        <h5 className="mb-3" style={{ color: "#1ec287" }}>Suivi nutrition</h5>
        <FoodTracker />
      </div>
    </div>
  );
}
