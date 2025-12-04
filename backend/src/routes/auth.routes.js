// Routes d'authentification
import { Router } from "express";
import { login, register, updateProfile, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

// POST /api/auth/register
router.post("/register", register);
// POST /api/auth/login
router.post("/login", login);
// POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);
// POST /api/auth/reset-password
router.post("/reset-password", resetPassword);
// PUT /api/auth/profile - Mettre à jour le profil (requiert authentification)
router.put("/profile", auth, updateProfile);

export default router;
