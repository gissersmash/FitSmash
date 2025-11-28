import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default function CaloriesDonutChart({ caloriesRestantes, objectif, entries = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const totalCalories = entries.reduce((sum, f) => sum + (f.calories || 0), 0);
  
  const colors = [
    "#1ec287", "#ffb347", "#ff6961", "#77dd77", "#aec6cf", "#f49ac2", 
    "#cfcfc4", "#b19cd9", "#ff9899", "#87ceeb", "#ffd700", "#ff69b4"
  ];

  const data = {
    labels: entries.map(f => f.name || f.foodName || "Aliment"),
    datasets: [
      {
        label: 'Calories',
        data: entries.map(f => f.calories || 0),
        backgroundColor: colors,
        borderColor: '#fff',
        borderWidth: 3,
        hoverBorderWidth: 5,
        hoverBorderColor: '#1ec287',
        hoverOffset: 15
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = ((value / totalCalories) * 100).toFixed(1);
            return ` ${label}: ${value} kcal (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
      easing: 'easeInOutQuart'
    },
    cutout: '65%',
    onHover: (event, activeElements) => {
      if (activeElements.length > 0) {
        setHoveredIndex(activeElements[0].index);
      } else {
        setHoveredIndex(null);
      }
    }
  };

  const handleLegendClick = (index) => {
    setHoveredIndex(index === hoveredIndex ? null : index);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ maxWidth: 280, margin: '0 auto', position: 'relative' }}>
        <Doughnut data={data} options={options} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#1ec287',
            animation: 'fadeIn 1s ease-in'
          }}>
            {totalCalories}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#999', 
            marginTop: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            kcal
          </div>
        </div>
      </div>

      {entries.length > 0 && (
        <div style={{ 
          marginTop: '24px', 
          maxHeight: '200px', 
          overflowY: 'auto',
          padding: '4px'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#666',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Légende interactive
          </div>
          {entries.map((entry, index) => {
            const percentage = ((entry.calories / totalCalories) * 100).toFixed(1);
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={index}
                onClick={() => handleLegendClick(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  marginBottom: '6px',
                  background: isHovered ? 'linear-gradient(135deg, #e8f4f0 0%, #f0fdf4 100%)' : '#f8fafb',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isHovered ? 'translateX(8px) scale(1.02)' : 'translateX(0) scale(1)',
                  border: isHovered ? '2px solid #1ec287' : '2px solid transparent',
                  boxShadow: isHovered ? '0 4px 12px rgba(30, 194, 135, 0.2)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: colors[index % colors.length],
                    boxShadow: isHovered ? '0 0 0 3px rgba(30, 194, 135, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s',
                    transform: isHovered ? 'scale(1.3)' : 'scale(1)'
                  }} />
                  <span style={{
                    fontSize: '13px',
                    color: isHovered ? '#1ec287' : '#333',
                    fontWeight: isHovered ? '600' : '500',
                    transition: 'all 0.3s'
                  }}>
                    {entry.name || entry.foodName || 'Aliment'}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  transition: 'all 0.3s'
                }}>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: isHovered ? '#1ec287' : '#666'
                  }}>
                    {entry.calories} kcal
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: '#999',
                    background: isHovered ? '#1ec287' : '#e5e7eb',
                    color: isHovered ? 'white' : '#666',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}>
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
