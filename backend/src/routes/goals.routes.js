// backend/src/routes/goals.routes.js
import express from "express";
import auth from "../middlewares/auth.js";
import { saveNutritionGoals, listGoals, updateGoal, deleteGoal } from "../controllers/goals.controller.js";

const router = express.Router();

// Routes protégées
router.get("/", auth, listGoals);
router.post("/", auth, saveNutritionGoals);
router.put("/:id", auth, updateGoal);
router.delete("/:id", auth, deleteGoal);

export default router;
