import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Lien invalide ou expiré");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/;

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      setError("Le mot de passe doit contenir au moins 8 caractères, dont une lettre et un chiffre");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la réinitialisation");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(err.message || "Erreur lors de la réinitialisation");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '28px',
          padding: '60px 40px',
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 70px rgba(0,0,0,0.35)',
          animation: 'scaleIn 0.5s'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px',
            boxShadow: '0 4px 16px rgba(30, 194, 135, 0.4)'
          }}>
            <i className="bi bi-check-circle-fill" style={{ fontSize: '60px', color: 'white' }}></i>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>
            Mot de passe réinitialisé !
          </h1>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '30px' }}>
            Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion...
          </p>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Éléments décoratifs */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '-100px',
        width: '300px',
        height: '300px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        right: '-150px',
        width: '400px',
        height: '400px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '480px',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Logo et titre */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          animation: 'fadeInDown 0.8s ease-out'
        }}>
          <img
            src="/logo/logo-fitsmash.png"
            alt="FITSMASH Logo"
            style={{
              width: '200px',
              marginBottom: '20px',
              filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.25))'
            }}
          />
          <h1 style={{
            color: 'white',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            letterSpacing: '-0.5px'
          }}>
            Nouveau mot de passe
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.95)',
            fontSize: '16px',
            margin: 0,
            fontWeight: '500'
          }}>
            Choisissez un mot de passe sécurisé
          </p>
        </div>

        {/* Carte formulaire */}
        <div style={{
          background: 'white',
          borderRadius: 28,
          boxShadow: '0 25px 70px rgba(0,0,0,0.35)',
          padding: '45px 40px',
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#333',
                fontSize: '14px'
              }}>
                <i className="bi bi-lock-fill me-2" style={{ color: '#1ec287' }}></i>
                Nouveau mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!token || loading}
                  style={{
                    width: '100%',
                    padding: '12px 45px 12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#1ec287')}
                  onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#999',
                    fontSize: '18px'
                  }}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#333',
                fontSize: '14px'
              }}>
                <i className="bi bi-shield-lock-fill me-2" style={{ color: '#1ec287' }}></i>
                Confirmer le mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={!token || loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#1ec287')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              />
            </div>

            <div style={{
              background: '#f0f9ff',
              border: '2px solid #0ea5e9',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#0369a1',
              lineHeight: '1.5'
            }}>
              <i className="bi bi-info-circle-fill me-2"></i>
              Le mot de passe doit contenir au moins 8 caractères, dont une lettre et un chiffre
            </div>

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '2px solid #ef4444',
                color: '#ef4444',
                padding: '12px 16px',
                borderRadius: '10px',
                marginBottom: '20px',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                animation: 'shake 0.5s'
              }}>
                <i className="bi bi-exclamation-triangle-fill"></i>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !token}
              style={{
                width: '100%',
                background: (loading || !token) ? '#9ca3af' : 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)',
                color: 'white',
                border: 'none',
                fontWeight: 'bold',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '16px',
                cursor: (loading || !token) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 16px rgba(30, 194, 135, 0.4)',
                opacity: (loading || !token) ? 0.7 : 1
              }}
              onMouseEnter={(e) => !(loading || !token) && (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !(loading || !token) && (e.target.style.transform = 'translateY(0)')}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Réinitialisation...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Réinitialiser le mot de passe
                </>
              )}
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            marginTop: '28px',
            paddingTop: '28px',
            borderTop: '2px solid #f0f0f0'
          }}>
            <span
              style={{
                color: "#1ec287",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: '15px',
                transition: 'all 0.3s'
              }}
              onClick={() => navigate("/")}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Retour à la connexion
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default ResetPassword;
