import React, { useEffect, useState } from "react";
import { getNutritionGoals } from "../services/goalService";

export default function MesObjectifs() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) require('../services/api').setToken(token);
    getNutritionGoals()
      .then(res => {
        setGoals(Array.isArray(res.data.goals) ? res.data.goals : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les objectifs.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-5">Chargement...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;

  return (
    <div className="container" style={{ maxWidth: 900, marginTop: 40, marginLeft: 240 }}>
      <div className="card shadow p-3 mb-4">
        <h5 className="mb-3" style={{ color: "#1ec287" }}>Mes objectifs nutritionnels enregistrés</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Type</th>
              <th>Objectif</th>
              <th>Pourcentage</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((obj, idx) => (
              <tr key={idx}>
                <td>{obj.type}</td>
                <td>{obj.objectif}</td>
                <td>{obj.type === "Calories" ? "-" : obj.pourcentage + "%"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
