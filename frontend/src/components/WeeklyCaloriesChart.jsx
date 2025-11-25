// frontend/src/components/WeeklyCaloriesChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function WeeklyCaloriesChart({ entries }) {
  // Regroupe les calories par jour
  const grouped = {};
  entries.forEach(e => {
    if (!e.createdAt) return;
    const date = new Date(e.createdAt).toLocaleDateString();
    grouped[date] = (grouped[date] || 0) + (e.calories || 0);
  });

  // Transforme en tableau pour Recharts
  const data = Object.keys(grouped).map(date => ({
    date,
    calories: grouped[date]
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="calories" stroke="#82ca9d" name="Calories consommées" />
      </LineChart>
    </ResponsiveContainer>
  );
}
