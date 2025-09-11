// Middleware d'authentification
import jwt from "jsonwebtoken";

// Middleware pour protéger les routes
export function auth(req, res, next) {
  // Récupération du header Authorization
  const header = req.headers.authorization || "";
  // Le token est envoyé sous la forme "Bearer <token>"
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  // Si pas de token → accès interdit
  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
    // Vérifie et décode le token avec la clé secrète
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // On met l'id du user dans req.user pour l’utiliser après
    req.user = { id: payload.id };

    next(); // continue vers la route demandée
  } catch {
    return res.status(401).json({ message: "Token invalide" });
  }
}

export default auth;
