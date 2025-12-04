import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default function CaloriesDonutChart({ caloriesRestantes, objectif, entries = [], onDeleteEntry }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [deleteModalEntry, setDeleteModalEntry] = useState(null);
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  marginBottom: '6px',
                  background: '#f8fafb',
                  borderRadius: '10px',
                  border: '2px solid transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: colors[index % colors.length],
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }} />
                  <span style={{
                    fontSize: '13px',
                    color: '#333',
                    fontWeight: '500'
                  }}>
                    {entry.name || entry.foodName || 'Aliment'}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px'
                }}>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#666'
                  }}>
                    {entry.calories} kcal
                  </span>
                  <span style={{
                    fontSize: '11px',
                    background: '#e5e7eb',
                    color: '#666',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: '600'
                  }}>
                    {percentage}%
                  </span>
                  {onDeleteEntry && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteModalEntry(entry);
                      }}
                      style={{
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        cursor: 'pointer',
                        fontSize: '18px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        fontWeight: 'bold'
                      }}
                      title={`Supprimer ${entry.name || entry.foodName}`}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {deleteModalEntry && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setDeleteModalEntry(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '440px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              animation: 'modalFadeIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}>
                <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '32px', color: '#dc2626' }}></i>
              </div>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '22px', 
                fontWeight: 'bold',
                color: '#1f2937'
              }}>
                Confirmer la suppression
              </h3>
              <p style={{ 
                margin: 0, 
                color: '#6b7280', 
                fontSize: '15px',
                lineHeight: '1.6'
              }}>
                Êtes-vous sûr de vouloir supprimer cet aliment ?
              </p>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#ef4444'
                }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: '600', 
                    color: '#1f2937',
                    fontSize: '15px',
                    marginBottom: '4px'
                  }}>
                    {deleteModalEntry.name || deleteModalEntry.foodName}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    {deleteModalEntry.calories} kcal
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setDeleteModalEntry(null)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  color: '#374151',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f3f4f6';
                }}
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onDeleteEntry(deleteModalEntry);
                  setDeleteModalEntry(null);
                }}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                }}
              >
                <i className="bi bi-trash me-2"></i>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
