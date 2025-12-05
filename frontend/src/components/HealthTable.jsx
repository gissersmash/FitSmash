import React, { useState } from "react";

export default function HealthTable({ entries, onDelete, showActions = true }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  if (!entries || entries.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '48px 20px',
        color: '#999'
      }}>
        <i className="bi bi-inbox" style={{ fontSize: '48px', display: 'block', marginBottom: '16px', opacity: 0.5 }}></i>
        <p style={{ margin: 0, fontSize: '14px' }}>Aucune entrée pour le moment.</p>
      </div>
    );
  }

  const activityIcons = {
    'Course à pied': '',
    'Vélo': '🚴',
    'Natation': '🏊',
    'Marche': '🚶',
    'Musculation': '',
    'Yoga': '',
    'Fitness': '🤸',
    'Tennis': '🎾',
    'Football': '⚽',
    'Basketball': '🏀',
    'Boxe': '🥊',
    'Danse': '💃'
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table" style={{ marginBottom: 0 }}>
        <thead>
          <tr style={{
            background: 'linear-gradient(135deg, #f8fafb 0%, #e8f4f0 100%)',
            borderRadius: '10px'
          }}>
            <th style={{
              padding: '14px 16px',
              fontSize: '13px',
              fontWeight: '700',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: 'none'
            }}>
              <i className="bi bi-calendar-event me-2"></i>
              Date
            </th>
            <th style={{
              padding: '14px 16px',
              fontSize: '13px',
              fontWeight: '700',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: 'none'
            }}>
              <i className="bi bi-speedometer2 me-2"></i>
              Poids (kg)
            </th>
            <th style={{
              padding: '14px 16px',
              fontSize: '13px',
              fontWeight: '700',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: 'none'
            }}>
              <i className="bi bi-moon-stars me-2"></i>
              Sommeil (h)
            </th>
            {showActions && (
              <th style={{
                padding: '14px 16px',
                fontSize: '13px',
                fontWeight: '700',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: 'none',
                textAlign: 'center'
              }}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr 
              key={entry.id}
              onMouseEnter={() => setHoveredRow(index)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                background: hoveredRow === index ? '#f0fdf4' : 'transparent',
                transition: 'all 0.2s',
                transform: hoveredRow === index ? 'scale(1.01)' : 'scale(1)',
                cursor: 'pointer'
              }}
            >
              <td style={{
                padding: '14px 16px',
                fontSize: '14px',
                color: '#333',
                fontWeight: '500',
                border: 'none',
                borderBottom: '1px solid #f0f0f0'
              }}>
                {new Date(entry.date).toLocaleDateString('fr-FR', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </td>
              <td style={{
                padding: '14px 16px',
                fontSize: '16px',
                color: '#1ec287',
                fontWeight: '700',
                border: 'none',
                borderBottom: '1px solid #f0f0f0'
              }}>
                {entry.weight}
              </td>
              <td style={{
                padding: '14px 16px',
                fontSize: '16px',
                color: '#f59e0b',
                fontWeight: '700',
                border: 'none',
                borderBottom: '1px solid #f0f0f0'
              }}>
                {entry.sleep}
              </td>
              {showActions && (
                <td style={{
                  padding: '14px 16px',
                  border: 'none',
                  borderBottom: '1px solid #f0f0f0',
                  textAlign: 'center'
                }}>
                  <button
                    className="btn btn-sm"
                    onClick={() => onDelete(entry.id)}
                    style={{
                      background: hoveredRow === index ? '#ef4444' : '#fee2e2',
                      color: hoveredRow === index ? 'white' : '#ef4444',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      fontWeight: '600',
                      fontSize: '13px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
