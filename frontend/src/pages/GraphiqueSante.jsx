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
  console.log('Données pour graphique santé:', entries); // debug
  return (
    <div style={{ minHeight: "100vh", background: "#FFFBEA" }}>
      <Sidebar />
      <div
        className="container d-flex justify-content-center"
        style={{
          maxWidth: 900,
          marginTop: 40,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          className="card shadow-lg p-4 mb-5 w-100"
          style={{
            maxWidth: 900,
            background:
              "linear-gradient(135deg, #e0ffe8 0%, #fffbe6 100%)",
            borderRadius: 24,
            boxShadow: "0 8px 32px rgba(30,194,135,0.12)",
            transition: "box-shadow 0.3s",
            animation: "fadeIn 0.7s",
          }}
        >
          <h3
            className="mb-4 text-center"
            style={{
              color: "#1ec287",
              fontWeight: "bold",
              letterSpacing: 1,
              textShadow: "0 2px 8px #cfcfc4",
            }}
          >
            <i
              className="bi bi-bar-chart"
              style={{ marginRight: 10 }}
            ></i>
            Graphique santé
          </h3>
          <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 24, maxWidth: 900, margin: '0 auto' }}>
            <HealthChart
              entries={entries.map((e) => ({
                weight: e.weight,
                sleep_hours: e.sleep,
                activity_minutes: e.activity,
                created_at: e.date,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
