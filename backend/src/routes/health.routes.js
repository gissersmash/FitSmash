// backend/src/routes/health.routes.js
import express from "express";
import auth from "../middlewares/auth.js"; // middleware d'auth
import {
  addHealthEntry,
  getHealthEntries,
  deleteHealthEntry,
  getStats
} from "../controllers/health.controller.js";

const router = express.Router();

// Ajouter une entrée
router.post("/", auth, addHealthEntry);

// Récupérer toutes les entrées
router.get("/", auth, getHealthEntries);

// Supprimer une entrée
router.delete("/:id", auth, deleteHealthEntry);

// Récupérer les stats par période
router.get("/stats/:period", auth, getStats);

export default router;
