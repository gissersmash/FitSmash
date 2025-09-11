import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default function CaloriesDonutChart({ caloriesRestantes, objectif, entries = [] }) {
  const totalCalories = entries.reduce((sum, f) => sum + (f.calories || 0), 0);
  const data = {
    labels: entries.map(f => f.name || f.foodName || "Aliment"),
    datasets: [
      {
        label: 'Calories',
        data: entries.map(f => f.calories || 0),
        backgroundColor: [
          "#1ec287", "#ffb347", "#ff6961", "#77dd77", "#aec6cf", "#f49ac2", "#cfcfc4"
        ],
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="card shadow p-3 mb-4">
      <h5 className="mb-3" style={{ color: "#1ec287" }}>Répartition des calories par aliment (aliments enregistrés)</h5>
      <div style={{ maxWidth: 320, margin: '0 auto', position: 'relative' }}>
        <Doughnut data={data} />
      </div>
      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <div style={{ fontWeight: 'bold', fontSize: 22, color: '#1ec287' }}>
          Objectif : {objectif} kcal
        </div>
        <div style={{ fontWeight: 'bold', fontSize: 20, color: '#ff6961', marginTop: 6 }}>
          Consommé : {totalCalories} kcal
        </div>
        <div style={{ fontWeight: 'bold', fontSize: 20, color: '#3b5998', marginTop: 6 }}>
          Restant : {caloriesRestantes} kcal
        </div>
      </div>
    </div>
  );
}
