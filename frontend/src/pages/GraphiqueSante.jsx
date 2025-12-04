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
        style={{
          maxWidth: 1100,
          marginTop: 40,
          marginLeft: 300,
          marginRight: 'auto',
          paddingBottom: 60
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)",
            borderRadius: 24,
            padding: 40,
            boxShadow: "0 10px 40px rgba(30,194,135,0.15)",
            border: '1px solid rgba(30, 194, 135, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #1ec287 0%, #16a970 50%, #1ec287 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s linear infinite'
          }} />
          
          <h3
            style={{
              color: "#1ec287",
              fontWeight: "bold",
              letterSpacing: 0,
              marginBottom: 32,
              fontSize: 28,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12
            }}
          >
            <i className="bi bi-activity" style={{ fontSize: 32 }}></i>
            Graphique Santé
          </h3>
          
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

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
