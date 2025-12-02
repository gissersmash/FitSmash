import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const curveOptions = [
  { key: "weight", label: "Poids (kg)", color: "#8884d8" },
  { key: "sleep_hours", label: "Sommeil (h)", color: "#82ca9d" },
  { key: "activity_minutes", label: "Activité (min)", color: "#ff7300" },
];

export default function HealthChart({ entries }) {
  const [selectedCurve, setSelectedCurve] = useState("weight");
  const [note, setNote] = useState("");

  // Charger/sauvegarder la note d'évolution
  useEffect(() => {
    const saved = localStorage.getItem("healthChartNote");
    if (saved) setNote(saved);
  }, []);
  const handleNoteChange = (e) => {
    setNote(e.target.value);
    localStorage.setItem("healthChartNote", e.target.value);
  };

  // Calcul des stats
  const stats = useMemo(() => {
    const values = entries
      .map((e) => Number(e[selectedCurve]))
      .filter((v) => !isNaN(v));
    if (!values.length) return { min: 0, max: 0, avg: 0 };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg =
      Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) /
      100;
    return { min, max, avg };
  }, [entries, selectedCurve]);

  return (
    <>
      <div className="d-flex justify-content-center mb-3">
        <select
          value={selectedCurve}
          onChange={(e) => setSelectedCurve(e.target.value)}
          className="form-select w-auto"
        >
          {curveOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width={450} height={500}>
        <BarChart data={entries}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="created_at"
            label={{
              value: "Date",
              position: "insideBottom",
              offset: -5,
              fontSize: 18,
              fontWeight: "bold",
              fill: "#333",
            }}
            tick={{ fontSize: 16, fontWeight: "bold", fill: "#333" }}
            axisLine={{ stroke: "#1ec287", strokeWidth: 3 }}
            tickLine={{ stroke: "#1ec287", strokeWidth: 2 }}
            tickFormatter={(date) => {
              if (!date) return "";
              const d = new Date(date);
              if (isNaN(d)) return date;
              const day = String(d.getDate()).padStart(2, "0");
              const month = String(d.getMonth() + 1).padStart(2, "0");
              const year = String(d.getFullYear()).slice(-2);
              return `${day}-${month}-${year}`;
            }}
          />
          <YAxis
            label={{
              value: curveOptions.find((opt) => opt.key === selectedCurve)
                ?.label,
              angle: -90,
              position: "insideLeft",
              fontSize: 18,
              fontWeight: "bold",
              fill: "#333",
            }}
            tick={{ fontSize: 16, fontWeight: "bold", fill: "#333" }}
            axisLine={{ stroke: "#1ec287", strokeWidth: 3 }}
            tickLine={{ stroke: "#1ec287", strokeWidth: 2 }}
          />
          <Tooltip />
          <Legend
            verticalAlign="top"
            align="center"
            wrapperStyle={{ fontWeight: "bold", fontSize: 14 }}
          />
          <Bar
            dataKey={selectedCurve}
            fill={curveOptions.find((opt) => opt.key === selectedCurve)?.color}
            name={curveOptions.find((opt) => opt.key === selectedCurve)?.label}
          >
            <LabelList dataKey={selectedCurve} position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center" style={{ fontWeight: 'bold', color: '#1ec287', fontSize: 18 }}>
        <span>Min : {stats.min} | Max : {stats.max} | Moyenne : {stats.avg}</span>
      </div>
    </>
  );
}
