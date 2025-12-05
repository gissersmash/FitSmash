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

    console.log('updateProfile - userId:', userId);
    console.log('updateProfile - username:', username);
    console.log('updateProfile - avatar length:', avatar ? avatar.length : 0);

    // Validation
    if (username && (username.trim().length < 3 || username.trim().length > 100)) {
      return res.status(400).json({ message: "Le nom d'utilisateur doit contenir entre 3 et 100 caractères" });
    }

    // Trouver l'utilisateur
    const user = await User.findByPk(userId);
    if (!user) {
      console.log('updateProfile - User not found:', userId);
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si le username est déjà pris par un autre utilisateur
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username: username.trim() } });
      if (existingUser && existingUser.id !== userId) {
        console.log('updateProfile - Username already taken:', username);
        return res.status(400).json({ message: "Ce nom d'utilisateur est déjà utilisé" });
      }
    }

    // Mettre à jour les champs fournis
    if (username !== undefined) user.username = username.trim();
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    console.log('updateProfile - Success');

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
    console.error('Erreur updateProfile:', e);
    console.error('Erreur détails:', e.message, e.name);
    return res.status(400).json({ message: e.message });
  }
}

// Route mot de passe oublié
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
      return res.json({ 
        message: "Si cet email existe, un lien de réinitialisation a été envoyé" 
      });
    }

    // Générer un token de réinitialisation (valide 1h)
    const resetToken = jwt.sign(
      { id: user.id, type: 'reset' }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    // Dans un vrai projet, on enverrait un email ici
    // Pour l'instant, on simule juste l'envoi
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    console.log(`📧 Lien de réinitialisation pour ${email}: ${resetLink}`);
    
    // En production, utiliser un service d'email comme:
    // - Nodemailer avec Gmail/SMTP
    // - SendGrid
    // - AWS SES
    // await sendEmail(email, 'Réinitialisation mot de passe', resetLink);

    return res.json({ 
      message: "Si cet email existe, un lien de réinitialisation a été envoyé",
      // Pour dev uniquement, à retirer en production
      resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined
    });
  } catch (e) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

// Route réinitialisation du mot de passe
export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token et nouveau mot de passe requis" });
    }

    // Vérifier et décoder le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Vérifier que c'est bien un token de réinitialisation
      if (decoded.type !== 'reset') {
        return res.status(400).json({ message: "Token invalide" });
      }
    } catch (err) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    // Trouver l'utilisateur
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Valider le nouveau mot de passe
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        message: "Le mot de passe doit contenir au moins 8 caractères, dont une lettre et un chiffre" 
      });
    }

    // Hasher et sauvegarder le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log(`✅ Mot de passe réinitialisé pour ${user.email}`);

    return res.json({ 
      message: "Mot de passe réinitialisé avec succès" 
    });
  } catch (e) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
