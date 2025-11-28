import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Utilisateur' };

  const menuItems = [
    { path: '/dashboard', icon: 'bi-house-door', label: 'Accueil' },
    { path: '/tableau-suivi', icon: 'bi-table', label: 'Tableau de suivi' },
    { path: '/graphique-sante', icon: 'bi-graph-up', label: 'Graphique santé' },
    { path: '/objectif', icon: 'bi-bullseye', label: 'Objectif' },
    { path: '/suivi-nutrition', icon: 'bi-apple', label: 'Suivi nutrition' }
  ];

  return (
    <div
      style={{
        width: 250,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1ec287 0%, #16a970 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header avec avatar */}
      <div 
        className="text-center py-4" 
        style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={user.avatar || 'https://api.dicebear.com/7.x/identicon/svg?seed=default'}
            alt="Avatar"
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '4px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              marginBottom: 12,
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
          <div 
            style={{
              position: 'absolute',
              bottom: 12,
              right: -2,
              width: 16,
              height: 16,
              background: '#4ade80',
              borderRadius: '50%',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          />
        </div>
        <h6 
          className="text-white mb-1" 
          style={{ 
            fontWeight: 'bold', 
            fontSize: 16,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {user.name}
        </h6>
        <small 
          style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: 12 
          }}
        >
          {user.email}
        </small>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-grow-1" style={{ paddingBottom: 20 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 24px',
                margin: '4px 12px',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.85)',
                background: isActive 
                  ? 'linear-gradient(90deg, rgba(255,255,255,0.25), rgba(255,255,255,0.15))' 
                  : 'transparent',
                textDecoration: 'none',
                borderRadius: 12,
                borderLeft: isActive ? '4px solid #fff' : '4px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                transform: isActive ? 'translateX(4px)' : 'translateX(0)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <div 
                style={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                  marginRight: 12,
                  transition: 'all 0.3s'
                }}
              >
                <i className={`bi ${item.icon}`} style={{ fontSize: 18 }}></i>
              </div>
              <span 
                style={{ 
                  fontSize: 15, 
                  fontWeight: isActive ? '600' : '500',
                  letterSpacing: '0.3px'
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div 
        style={{
          padding: '16px 20px',
          background: 'rgba(0,0,0,0.1)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center'
        }}
      >
        <small style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
          © 2025 FitSmash
        </small>
      </div>
    </div>
  );
}
