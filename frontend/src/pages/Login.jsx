import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/authService";
import { setToken } from "../services/api";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Connexion
        console.log("Tentative de login avec :", { email, password });
        const res = await login({ email, password });
        console.log("Réponse backend login :", res.data);

        if (res?.data?.token) {
          localStorage.setItem("token", res.data.token);
          setToken(res.data.token);
          const usernameStored = res.data.user?.username || res.data.user?.name || email.split('@')[0];
          const userAvatar = res.data.user?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(usernameStored)}&size=128`;
          localStorage.setItem("user", JSON.stringify({
            name: usernameStored,
            email: email,
            avatar: userAvatar
          }));
          localStorage.setItem("username", usernameStored);
          navigate("/dashboard");
        }
      } else {
        // Inscription
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/;

        if (password !== confirmPassword) {
          setError("Les mots de passe ne correspondent pas.");
          setLoading(false);
          return;
        }
        if (!passwordRegex.test(password)) {
          setError("Le mot de passe doit contenir au moins 8 caractères, dont une lettre et un chiffre.");
          setLoading(false);
          return;
        }

        console.log("Tentative d'inscription avec :", { username, email, password });
        const res = await register({ username, email, password });
        console.log("Réponse backend register :", res.data);

        alert("✅ Inscription réussie ! Connectez-vous maintenant.");
        setIsLogin(true);
        setUsername(""); 
        setEmail(""); 
        setPassword(""); 
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Erreur API :", err.response?.data);
      setError(err.response?.data?.message || "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

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

      {/* Formulaire centré */}
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
              width: '240px', 
              marginBottom: '20px',
              filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.25))'
            }} 
          />
          <h1 style={{ 
            color: 'white', 
            fontSize: '36px', 
            fontWeight: 'bold',
            marginBottom: '10px',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            letterSpacing: '-0.5px'
          }}>
            {isLogin ? 'Bienvenue !' : 'Créer un compte'}
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.95)', 
            fontSize: '17px',
            margin: 0,
            fontWeight: '500'
          }}>
            {isLogin ? 'Connectez-vous pour suivre vos calories' : 'Rejoignez FitSmash dès maintenant'}
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
          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#333',
                fontSize: '14px'
              }}>
                <i className="bi bi-person-circle me-2" style={{ color: '#1ec287' }}></i>
                Nom d'utilisateur
              </label>
              <input
                type="text"
                placeholder="Votre nom"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
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
                onFocus={(e) => e.target.style.borderColor = '#1ec287'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>
          )}
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#333',
              fontSize: '14px'
            }}>
              <i className="bi bi-envelope-fill me-2" style={{ color: '#1ec287' }}></i>
              Email
            </label>
            <input
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
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
              onFocus={(e) => e.target.style.borderColor = '#1ec287'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#333',
              fontSize: '14px'
            }}>
              <i className="bi bi-lock-fill me-2" style={{ color: '#1ec287' }}></i>
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '45px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1ec287'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
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

          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#333',
                fontSize: '14px'
              }}>
                <i className="bi bi-shield-lock-fill me-2" style={{ color: '#1ec287' }}></i>
                Confirmez le mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
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
                onFocus={(e) => e.target.style.borderColor = '#1ec287'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>
          )}

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
            disabled={loading}
            style={{ 
              width: '100%',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)',
              color: 'white',
              border: 'none', 
              fontWeight: 'bold', 
              padding: '14px',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 16px rgba(30, 194, 135, 0.4)',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Chargement...
              </>
            ) : (
              <>
                <i className={`bi ${isLogin ? 'bi-box-arrow-in-right' : 'bi-person-plus-fill'} me-2`}></i>
                {isLogin ? "Se connecter" : "S'inscrire"}
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
          <span style={{ color: '#666', fontSize: '15px' }}>
            {isLogin ? "Pas encore inscrit ?" : "Déjà inscrit ?"}{" "}
          </span>
          <span
            style={{ 
              color: "#1ec287", 
              cursor: "pointer", 
              fontWeight: "bold",
              fontSize: '15px',
              transition: 'all 0.3s'
            }}
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setPassword("");
              setConfirmPassword("");
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            {isLogin ? "Créer un compte" : "Se connecter"}
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
      `}</style>
    </div>
  );
}

export default Login;