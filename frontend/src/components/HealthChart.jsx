import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function HealthChart({ entries }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={entries}>
        <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="created_at" label={{ value: 'Date', position: 'insideBottom', offset: -5 }} />
  <YAxis label={{ value: 'Valeur (kg / h / min)', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend
          verticalAlign="top"
          align="center"
          wrapperStyle={{ fontWeight: 'bold', fontSize: 14 }}
          payload={[
            { value: 'Poids (kg)', type: 'line', color: '#8884d8' },
            { value: 'Sommeil (h)', type: 'line', color: '#82ca9d' },
            { value: 'Activité (min)', type: 'line', color: '#ff7300' }
          ]}
        />
        <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Poids (kg)" />
        <Line type="monotone" dataKey="sleep_hours" stroke="#82ca9d" name="Sommeil (h)" />
        <Line type="monotone" dataKey="activity_minutes" stroke="#ff7300" name="Activité (min)" />
      </LineChart>
    </ResponsiveContainer>
  );
}
