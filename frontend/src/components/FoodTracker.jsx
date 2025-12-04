import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { deleteFood } from "../services/foodService";
import { searchFoodsByName } from "../services/nutritionService";
import { setToken } from "../services/api";
import axios from "axios";

export default function FoodTracker() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/foods", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFoods(
        Array.isArray(res.data)
          ? res.data
          : res.data.foods || res.data.data || []
      );
    } catch (err) {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setToken(token);
    fetchFoods();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteFood(id);
      setFoods(foods.filter((f) => f.id !== id));
    } catch (err) {
      // Erreur silencieuse
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await searchFoodsByName(searchTerm);
      setFoods(Array.isArray(results) ? results : []);
    } catch (err) {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFBEA" }}>
      <Sidebar />
      <div style={{ 
        maxWidth: 1200, 
        marginTop: 40, 
        marginLeft: 300, 
        marginRight: 'auto', 
        paddingBottom: 60 
      }}>
        <div style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)",
          borderRadius: 24,
          padding: 40,
          boxShadow: "0 10px 40px rgba(30,194,135,0.15)",
          border: '1px solid rgba(30, 194, 135, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Bordure animée */}
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

          <h5 style={{
            color: "#1ec287",
            fontWeight: "bold",
            fontSize: 28,
            marginBottom: 32,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12
          }}>
            <i className="bi bi-apple" style={{ fontSize: 32 }}></i>
            Suivi Nutrition
          </h5>

          {/* Stats rapides */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '16px', 
            marginBottom: '32px' 
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '20px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
              transition: 'transform 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Aliments</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>{foods.length}</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              padding: '20px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(240, 147, 251, 0.3)',
              transition: 'transform 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Calories</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
                {foods.reduce((sum, f) => sum + (Number(f.calories) || 0), 0)}
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              padding: '20px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(79, 172, 254, 0.3)',
              transition: 'transform 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Protéines Totales</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
                {foods.reduce((sum, f) => sum + (Number(f.proteins || f.proteines) || 0), 0)}g
              </div>
            </div>
          </div>

          {/* Champ de recherche amélioré */}
          <form onSubmit={handleSearch} style={{ marginBottom: '32px' }}>
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              background: 'white',
              padding: '8px',
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: '2px solid #e0e0e0',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#1ec287'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                flex: 1,
                padding: '0 12px'
              }}>
                <i className="bi bi-search" style={{ fontSize: '20px', color: '#1ec287', marginRight: '12px' }}></i>
                <input
                  type="text"
                  placeholder="Rechercher un aliment par nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#333'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)',
                  color: 'white',
                  fontWeight: '700',
                  borderRadius: '12px',
                  border: 'none',
                  padding: '12px 28px',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(30,194,135,0.3)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(30,194,135,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,194,135,0.3)';
                }}
              >
                <i className="bi bi-search me-2"></i>
                Rechercher
              </button>
              <button
                type="button"
                onClick={() => { setSearchTerm(''); fetchFoods(); }}
                style={{
                  background: '#f0f0f0',
                  color: '#666',
                  fontWeight: '600',
                  borderRadius: '12px',
                  border: 'none',
                  padding: '12px 20px',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e0e0e0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f0f0f0';
                }}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Réinitialiser
              </button>
            </div>
          </form>

          {/* Tableau moderne */}
          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)'
            }}>
              <div className="spinner-border" style={{ color: "#1ec287", width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p style={{ marginTop: 16, color: "#1ec287", fontWeight: '600', fontSize: '15px' }}>
                Chargement des aliments...
              </p>
            </div>
          ) : foods.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)'
            }}>
              <i className="bi bi-inbox" style={{ fontSize: 60, color: '#e0e0e0', marginBottom: 16 }}></i>
              <p style={{ color: '#999', fontSize: '16px', fontWeight: '500' }}>Aucun aliment trouvé</p>
            </div>
          ) : (
            <div style={{ 
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{
                      background: 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)',
                      color: 'white'
                    }}>
                      {foods.length > 0 &&
                        Object.keys(foods[0]).map((key) =>
                          key !== "id" && key !== "image" ? (
                            <th key={key} style={{ 
                              padding: '18px 16px', 
                              fontWeight: '700',
                              fontSize: '13px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              textAlign: 'left'
                            }}>
                              {key === 'name' ? 'Aliment' : 
                               key === 'calories' ? 'Calories' :
                               key === 'proteins' || key === 'proteines' ? 'Protéines' :
                               key === 'carbs' || key === 'glucides' ? '🌾 Glucides' :
                               key === 'fats' || key === 'lipides' ? '🥑 Lipides' :
                               key}
                            </th>
                          ) : null
                        )}
                      <th style={{ 
                        padding: '18px 16px', 
                        fontWeight: '700',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'center'
                      }}>📷 Image</th>
                      <th style={{ 
                        padding: '18px 16px', 
                        fontWeight: '700',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'center'
                      }}>⚙️ Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foods.map((food, index) => (
                      <tr
                        key={food.id}
                        style={{
                          background: index % 2 === 0 ? '#f8fafb' : 'white',
                          borderBottom: '1px solid #e0e0e0',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#e8f4f0';
                          e.currentTarget.style.transform = 'scale(1.01)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = index % 2 === 0 ? '#f8fafb' : 'white';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {Object.keys(food).map((key) =>
                          key !== "id" && key !== "image" ? (
                            <td key={key} style={{ 
                              padding: '16px', 
                              color: '#333',
                              fontSize: '14px',
                              fontWeight: key === 'name' ? '600' : '500'
                            }}>
                              {key === 'calories' || key === 'proteins' || key === 'proteines' || key === 'carbs' || key === 'glucides' || key === 'fats' || key === 'lipides' ? (
                                <span style={{
                                  background: 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)',
                                  color: 'white',
                                  padding: '4px 10px',
                                  borderRadius: '8px',
                                  fontWeight: '700',
                                  fontSize: '13px'
                                }}>
                                  {food[key]}
                                </span>
                              ) : (
                                food[key]
                              )}
                            </td>
                          ) : null
                        )}
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          {food.image ? (
                            <img
                              src={food.image}
                              alt="aliment"
                              style={{
                                width: 70,
                                height: 70,
                                objectFit: 'cover',
                                borderRadius: 12,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                border: '3px solid white',
                                transition: 'transform 0.3s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                          ) : (
                            <div style={{
                              width: 70,
                              height: 70,
                              borderRadius: 12,
                              background: '#e0e0e0',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '24px'
                            }}>
                              🍽️
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <button
                            style={{
                              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: 10,
                              padding: '8px 16px',
                              fontWeight: '700',
                              fontSize: '13px',
                              transition: 'all 0.3s',
                              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleDelete(food.id)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                            }}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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