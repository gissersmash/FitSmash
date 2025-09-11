import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { createGoal, listGoals, updateGoal, deleteGoal } from "../controllers/goals.controller.js";
const router = Router();

// Modifier un objectif
router.put("/:id", auth, updateGoal);

// Supprimer un objectif
router.delete("/:id", auth, deleteGoal);

// POST /api/goals → Enregistrer des objectifs
router.post("/", auth, createGoal);

// GET /api/goals → Récupérer les objectifs
router.get("/", auth, listGoals);

export default router;
