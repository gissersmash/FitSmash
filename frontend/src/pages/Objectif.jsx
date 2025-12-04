import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import * as goalService from "../services/goalService";

export default function Objectif() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [objectifs, setObjectifs] = useState([
    { type: "Calories", objectif: "", pourcentage: "" },
    { type: "Glucides", objectif: "", pourcentage: "" },
    { type: "Lipides", objectif: "", pourcentage: "" },
    { type: "Protéines", objectif: "", pourcentage: "" }
  ]);
  const [validationMsg, setValidationMsg] = useState("");

  const totalPct = objectifs
    .slice(1)
    .reduce((sum, obj) => sum + (parseInt(obj.pourcentage, 10) || 0), 0);

  // Récupérer les objectifs existants
  useEffect(() => {
    goalService.getNutritionGoals()
      .then(goals => {
        if (goals.length >= 4) {
          setObjectifs(goals.slice(-4).map(g => ({
            type: g.type,
            objectif: g.value,
            pourcentage: ["Glucides","Lipides","Protéines"].includes(g.type) ? g.pourcentage : ""
          })));
        }
      })
      .catch(err => {});
  }, []);

  // Gestion input Calories
  const handleChangeCalories = (e) => {
    const kcal = parseInt(e.target.value, 10);
    const newArr = [...objectifs];
    newArr[0].objectif = e.target.value;

    if (!isNaN(kcal)) {
      const glucidesPct = 50, lipidesPct = 30, proteinesPct = 20;
      newArr[1].pourcentage = glucidesPct.toString();
      newArr[2].pourcentage = lipidesPct.toString();
      newArr[3].pourcentage = proteinesPct.toString();

      newArr[1].objectif = Math.round((kcal * glucidesPct) / 100 / 4).toString();
      newArr[2].objectif = Math.round((kcal * lipidesPct) / 100 / 9).toString();
      newArr[3].objectif = Math.round((kcal * proteinesPct) / 100 / 4).toString();
    } else {
      newArr.slice(1).forEach(obj => { obj.objectif = ""; obj.pourcentage = ""; });
    }
    setObjectifs(newArr);
  };

  // Validation
  const handleValidate = async () => {
    setServerError("");
    setLoading(true);

    if (totalPct !== 100) {
      setValidationMsg("Le total des pourcentages doit être égal à 100%.");
      setLoading(false);
      return;
    }

    try {
      // Préparer payload correct pour le backend
      const payload = objectifs.map(o => ({
        type: o.type,
        value: parseFloat(o.objectif) || 0,
        pourcentage: o.pourcentage ? parseInt(o.pourcentage, 10) : null
      }));

      const savedGoals = await goalService.saveNutritionGoals(payload);

      // Sauvegarde locale
      localStorage.setItem("goals", JSON.stringify(savedGoals));

      setValidationMsg("Objectifs validés !");
      setLoading(false);
      window.location.href = "/dashboard";
    } catch (err) {
      setServerError("Erreur lors de l'enregistrement côté serveur.");
      setLoading(false);
    }
  };

  const handleClear = () => setObjectifs([
    { type: "Calories", objectif: "", pourcentage: "" },
    { type: "Glucides", objectif: "", pourcentage: "" },
    { type: "Lipides", objectif: "", pourcentage: "" },
    { type: "Protéines", objectif: "", pourcentage: "" }
  ]);

  return (
    <div style={{ minHeight: "100vh", background: "#FFFBEA" }}>
      <Sidebar />
      <div style={{ maxWidth: 1000, marginTop: 40, marginLeft: 300, marginRight: 'auto', paddingBottom: 60 }}>
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

          <h3 style={{ 
            color: '#1ec287', 
            fontWeight: 'bold',
            marginBottom: 32,
            fontSize: 28,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12
          }}>
            <i className="bi bi-bullseye" style={{ fontSize: 32 }}></i>
            Objectifs Nutritionnels
          </h3>

          {/* Cards de résumé */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
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
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Calories</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{objectifs[0].objectif || '-'}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>kcal/jour</div>
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
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Glucides</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{objectifs[1].objectif || '-'}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>g ({objectifs[1].pourcentage || 0}%)</div>
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
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Lipides</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{objectifs[2].objectif || '-'}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>g ({objectifs[2].pourcentage || 0}%)</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              padding: '20px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(56, 239, 125, 0.3)',
              transition: 'transform 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Protéines</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{objectifs[3].objectif || '-'}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>g ({objectifs[3].pourcentage || 0}%)</div>
            </div>
          </div>

          {/* Barre de progression des pourcentages */}
          <div style={{
            background: '#f0f0f0',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '32px',
            border: totalPct === 100 ? '2px solid #10b981' : '2px solid #e0e0e0',
            transition: 'all 0.3s'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                Répartition macronutriments
              </span>
              <span style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: totalPct === 100 ? '#10b981' : '#ef4444',
                background: totalPct === 100 ? '#f0fdf4' : '#fef2f2',
                padding: '4px 12px',
                borderRadius: '20px'
              }}>
                {totalPct}%
              </span>
            </div>
            <div style={{ 
              height: '12px', 
              background: '#e0e0e0', 
              borderRadius: '20px', 
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(totalPct, 100)}%`,
                background: totalPct === 100 
                  ? 'linear-gradient(90deg, #10b981 0%, #38ef7d 100%)'
                  : 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)',
                borderRadius: '20px',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }} />
            </div>
            {totalPct !== 100 && (
              <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '8px', fontWeight: '500' }}>
                <i className="bi bi-exclamation-triangle-fill me-1"></i>
                Le total doit être égal à 100%
              </div>
            )}
          </div>

          {/* Formulaire */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '24px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            marginBottom: '24px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: '600', color: '#333', marginBottom: '8px', display: 'block', fontSize: '14px' }}>
                <i className="bi bi-lightning-charge-fill me-2" style={{ color: '#667eea' }}></i>
                Objectif Calorique (kcal/jour)
              </label>
              <input 
                type="number" 
                value={objectifs[0].objectif}
                placeholder="Ex: 2000"
                onChange={handleChangeCalories}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1ec287'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '16px' 
            }}>
              {objectifs.slice(1).map((obj, idx) => (
                <div key={idx} style={{
                  background: '#f8fafb',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {obj.type}
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1ec287', marginBottom: '4px' }}>
                    {obj.objectif || '-'} g
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: '600',
                    color: 'white',
                    background: 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    display: 'inline-block'
                  }}>
                    {obj.pourcentage || 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={handleClear}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: '2px solid #ef4444',
                background: 'white',
                color: '#ef4444',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#ef4444';
              }}
            >
              <i className="bi bi-trash me-2"></i>
              Réinitialiser
            </button>

            <button 
              onClick={handleValidate}
              disabled={loading}
              style={{
                padding: '12px 32px',
                borderRadius: '12px',
                border: 'none',
                background: totalPct === 100 
                  ? 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)'
                  : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                color: 'white',
                fontWeight: '700',
                cursor: totalPct === 100 ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s',
                fontSize: '15px',
                boxShadow: totalPct === 100 ? '0 4px 16px rgba(30, 194, 135, 0.3)' : 'none',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (totalPct === 100) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 194, 135, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = totalPct === 100 ? '0 4px 16px rgba(30, 194, 135, 0.3)' : 'none';
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Enregistrement...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Valider mes objectifs
                </>
              )}
            </button>
          </div>

          {/* Messages */}
          {validationMsg && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              borderRadius: '12px',
              background: totalPct === 100 ? '#f0fdf4' : '#fef2f2',
              border: `2px solid ${totalPct === 100 ? '#10b981' : '#ef4444'}`,
              color: totalPct === 100 ? '#10b981' : '#ef4444',
              fontWeight: '600',
              textAlign: 'center',
              animation: 'slideIn 0.3s ease-out'
            }}>
              <i className={`bi ${totalPct === 100 ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2`}></i>
              {validationMsg}
            </div>
          )}

          {serverError && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              borderRadius: '12px',
              background: '#fef2f2',
              border: '2px solid #ef4444',
              color: '#ef4444',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {serverError}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
