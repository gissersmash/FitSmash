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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
          const avatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(usernameStored)}`;
          localStorage.setItem("user", JSON.stringify({
            name: usernameStored,
            email: email,
            avatar
          }));
          navigate("/dashboard");
        }
      } else {
        // Inscription
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/;

        if (password !== confirmPassword) {
          setError("Les mots de passe ne correspondent pas.");
          return;
        }
        if (!passwordRegex.test(password)) {
          setError("Le mot de passe doit contenir au moins 8 caractères, dont une lettre et un chiffre.");
          return;
        }

        console.log("Tentative d'inscription avec :", { username, email, password });
        const res = await register({ username, email, password });
        console.log("Réponse backend register :", res.data);

        alert("Inscription réussie ! Connectez-vous maintenant.");
        setIsLogin(true);
        setUsername(""); 
        setEmail(""); 
        setPassword(""); 
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Erreur API :", err.response?.data);
      setError(err.response?.data?.message || "Erreur réseau");
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBEA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <img src="/logo/logo-fitsmash.png" alt="FITSMASH Logo" style={{ width: '40vw', maxWidth: 500, minWidth: 220, marginBottom: 40, display: 'block' }} />
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32, width: '100%', maxWidth: 420 }}>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Nom d'utilisateur</label>
              <input
                type="text"
                className="form-control"
                placeholder="Votre nom"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="exemple@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              placeholder="Votre mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Confirmez le mot de passe</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirmez le mot de passe"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="d-flex flex-column gap-2 mb-3">
            <button
              type="button"
              className="btn w-100 google-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', backgroundColor: '#db4437', color: 'white', border: 'none' }}
            >
              <i className="bi bi-google" style={{ fontSize: 20, marginRight: 8 }}></i>
              Connexion avec Google
            </button>
            <button type="button" className="btn btn-outline-primary w-100" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', backgroundColor: '#3b5998', color: 'white', border: 'none' }}>
              <i className="bi bi-facebook" style={{ fontSize: 20, marginRight: 8 }}></i>
              Connexion avec Facebook
            </button>
          </div>
          <button className="btn w-100 mt-3" type="submit" style={{ backgroundColor: '#1ec287', border: 'none', fontWeight: 'bold' }}>
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>
        <div className="text-center mt-3">
          {isLogin ? "Pas encore inscrit ?" : "Déjà inscrit ?"} {" "}
          <span
            style={{ color: "#1ec287", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Inscrivez-vous" : "Connectez-vous"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
