import React, { useState, useEffect } from "react";
import HealthChart from "../components/HealthChart";
import { getHealthEntries } from "../services/healthService";
import Sidebar from "../components/Sidebar";

export default function GraphiqueSante() {
  const [entries, setEntries] = useState([]);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUnauthorized(true);
      return;
    }
    require("../services/api").setToken(token);
    getHealthEntries()
      .then((res) => {
        console.log("Réponse API:", res); // 👈 debug
        setEntries(Array.isArray(res) ? res : res.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setUnauthorized(true);
        }
      });
  }, []);

  if (unauthorized) {
    window.location.href = "/login";
    return null;
  }
  return (
    <div style={{ minHeight: "100vh", background: "#FFFBEA" }}>
      <Sidebar />
      <div
        className="container"
        style={{
          maxWidth: 900,
          marginTop: 40,
          marginLeft: 240,
        }}
      >
        <div className="card shadow p-3 mb-4">
          <h5 className="mb-3" style={{ color: "#1ec287" }}>
            Graphique santé
          </h5>
          <HealthChart
            entries={entries.map((e) => ({
              weight: e.poids,
              sleep_hours: e.sommeil,
              activity_minutes: e.activite,
              created_at: e.date,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
