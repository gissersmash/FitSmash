import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = { id: payload.id }; // Définir req.user avec l'objet user
    req.userId = payload.id; // Garder aussi req.userId pour compatibilité
    next();
  } catch {
    return res.status(401).json({ message: "Token invalide" });
  }
}
export default auth;
