// Contrôleur d'authentification

import bcrypt from "bcryptjs";         // Pour hasher les mots de passe
import jwt from "jsonwebtoken";        // Pour générer des tokens JWT
import { User } from "../models/User.js"; // Modèle User
import { registerSchema, loginSchema } from "../utils/validators.js"; // Validation des entrées

// Route d'inscription
export async function register(req, res) {
  try {
    // Validation des données avec Zod
    const data = registerSchema.parse(req.body);

    // Vérifier si email déjà utilisé
    const exists = await User.findOne({ where: { email: data.email } });
    if (exists) return res.status(409).json({ message: "Email déjà utilisé" });

    // Hasher le mot de passe
    const hash = await bcrypt.hash(data.password, 10);

    // Créer le user
    const user = await User.create({ ...data, password: hash });

    // Retourner l'utilisateur (sans le mot de passe)
    return res.status(201).json({ id: user.id, username: user.username, email: user.email });
  } catch (e) {
    return res.status(400).json({ message: e.errors?.[0]?.message || e.message });
  }
}

// Route de connexion
export async function login(req, res) {
  try {
    // Validation des données
    const { email, password } = loginSchema.parse(req.body);

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Identifiants invalides" });

    // Vérifier le mot de passe
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Identifiants invalides" });

    // Générer un token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Retourner le token + infos user
    return res.json({ 
      token, 
      user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar } 
    });
  } catch (e) {
    return res.status(400).json({ message: e.errors?.[0]?.message || e.message });
  }
}

// Route de mise à jour du profil
export async function updateProfile(req, res) {
  try {
    const userId = req.userId; // Fourni par le middleware auth
    const { username, avatar } = req.body;

    // Trouver l'utilisateur
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Mettre à jour les champs fournis
    if (username !== undefined) user.username = username;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    // Retourner l'utilisateur mis à jour (sans le mot de passe)
    return res.json({ 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        avatar: user.avatar 
      } 
    });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}
