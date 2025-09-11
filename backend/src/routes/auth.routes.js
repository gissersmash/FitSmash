// Routes d'authentification
import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";

const router = Router();

// POST /api/auth/register
router.post("/register", register);
// POST /api/auth/login
router.post("/login", login);

export default router;
