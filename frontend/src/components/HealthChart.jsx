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
  Area,
  ComposedChart,
  Line
} from "recharts";

const curveOptions = [
  { key: "weight", label: "Poids (kg)", color: "#8884d8", gradient: ["#8884d8", "#6366f1"] },
  { key: "sleep_hours", label: "Sommeil (h)", color: "#82ca9d", gradient: ["#82ca9d", "#10b981"] },
  { key: "activity_minutes", label: "Activité (min)", color: "#ff7300", gradient: ["#ff7300", "#ef4444"] },
];

export default function HealthChart({ entries }) {
  const [selectedCurve, setSelectedCurve] = useState("weight");
  const [chartType, setChartType] = useState("bar");

  // Calcul des stats amélioré
  const stats = useMemo(() => {
    const values = entries
      .map((e) => Number(e[selectedCurve]))
      .filter((v) => !isNaN(v));
    if (!values.length) return { min: 0, max: 0, avg: 0, trend: 0, evolution: 0 };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
    
    // Calcul de la tendance (différence entre première et dernière valeur)
    const trend = values.length > 1 ? ((values[values.length - 1] - values[0]) / values[0] * 100).toFixed(1) : 0;
    
    // Évolution (différence dernière - première)
    const evolution = values.length > 1 ? (values[values.length - 1] - values[0]).toFixed(1) : 0;
    
    return { min, max, avg, trend, evolution };
  }, [entries, selectedCurve]);

  const currentOption = curveOptions.find((opt) => opt.key === selectedCurve);
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(0, 0, 0, 0.85)',
          padding: '12px 16px',
          borderRadius: '10px',
          border: '2px solid #1ec287',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        }}>
          <p style={{ color: '#fff', margin: 0, fontWeight: 'bold', marginBottom: '6px', fontSize: '13px' }}>
            {payload[0].payload.created_at ? new Date(payload[0].payload.created_at).toLocaleDateString('fr-FR') : 'Date'}
          </p>
          <p style={{ color: currentOption?.color, margin: 0, fontSize: '15px', fontWeight: 'bold' }}>
            {currentOption?.label}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Contrôles améliorés */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '12px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <select
          value={selectedCurve}
          onChange={(e) => setSelectedCurve(e.target.value)}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            border: '2px solid #1ec287',
            background: 'white',
            color: '#333',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.3s',
            boxShadow: '0 2px 8px rgba(30, 194, 135, 0.1)'
          }}
        >
          {curveOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '8px', background: '#f0f0f0', padding: '4px', borderRadius: '12px' }}>
          <button
            onClick={() => setChartType('bar')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: chartType === 'bar' ? '#1ec287' : 'transparent',
              color: chartType === 'bar' ? 'white' : '#666',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <i className="bi bi-bar-chart-fill me-1"></i>
            Barres
          </button>
          <button
            onClick={() => setChartType('line')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: chartType === 'line' ? '#1ec287' : 'transparent',
              color: chartType === 'line' ? 'white' : '#666',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <i className="bi bi-graph-up me-1"></i>
            Courbe
          </button>
        </div>
      </div>

      {/* Stats cards améliorées */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
        gap: '12px', 
        marginBottom: '24px',
        padding: '0 8px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          transition: 'transform 0.3s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Minimum</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{stats.min}</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)',
          transition: 'transform 0.3s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Maximum</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{stats.max}</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)',
          transition: 'transform 0.3s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Moyenne</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{stats.avg}</div>
        </div>

        <div style={{
          background: stats.trend >= 0 ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: stats.trend >= 0 ? '0 4px 12px rgba(56, 239, 125, 0.3)' : '0 4px 12px rgba(235, 51, 73, 0.3)',
          transition: 'transform 0.3s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tendance</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
            {stats.trend > 0 ? '+' : ''}{stats.trend}%
          </div>
        </div>
      </div>

      {/* Graphique */}
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'bar' ? (
          <BarChart data={entries} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={currentOption?.gradient[0]} stopOpacity={0.9}/>
                <stop offset="100%" stopColor={currentOption?.gradient[1]} stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.5} />
            <XAxis
              dataKey="created_at"
              tick={{ fontSize: 12, fontWeight: '500', fill: '#666' }}
              axisLine={{ stroke: '#1ec287', strokeWidth: 2 }}
              tickLine={{ stroke: '#1ec287' }}
              tickFormatter={(date) => {
                if (!date) return "";
                const d = new Date(date);
                if (isNaN(d)) return date;
                const day = String(d.getDate()).padStart(2, "0");
                const month = String(d.getMonth() + 1).padStart(2, "0");
                return `${day}/${month}`;
              }}
            />
            <YAxis
              tick={{ fontSize: 12, fontWeight: '500', fill: '#666' }}
              axisLine={{ stroke: '#1ec287', strokeWidth: 2 }}
              tickLine={{ stroke: '#1ec287' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey={selectedCurve}
              fill="url(#colorGradient)"
              radius={[8, 8, 0, 0]}
              animationDuration={1200}
              animationEasing="ease-in-out"
            >
              <LabelList 
                dataKey={selectedCurve} 
                position="top" 
                style={{ fill: '#333', fontWeight: 'bold', fontSize: '12px' }}
              />
            </Bar>
          </BarChart>
        ) : (
          <ComposedChart data={entries} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={currentOption?.color} stopOpacity={0.3}/>
                <stop offset="100%" stopColor={currentOption?.color} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.5} />
            <XAxis
              dataKey="created_at"
              tick={{ fontSize: 12, fontWeight: '500', fill: '#666' }}
              axisLine={{ stroke: '#1ec287', strokeWidth: 2 }}
              tickLine={{ stroke: '#1ec287' }}
              tickFormatter={(date) => {
                if (!date) return "";
                const d = new Date(date);
                if (isNaN(d)) return date;
                const day = String(d.getDate()).padStart(2, "0");
                const month = String(d.getMonth() + 1).padStart(2, "0");
                return `${day}/${month}`;
              }}
            />
            <YAxis
              tick={{ fontSize: 12, fontWeight: '500', fill: '#666' }}
              axisLine={{ stroke: '#1ec287', strokeWidth: 2 }}
              tickLine={{ stroke: '#1ec287' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={selectedCurve}
              fill="url(#colorArea)"
              stroke="none"
              animationDuration={1200}
            />
            <Line
              type="monotone"
              dataKey={selectedCurve}
              stroke={currentOption?.color}
              strokeWidth={3}
              dot={{ fill: currentOption?.color, r: 5, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7, strokeWidth: 3 }}
              animationDuration={1200}
              animationEasing="ease-in-out"
            />
          </ComposedChart>
        )}
      </ResponsiveContainer>
    </>
  );
}
