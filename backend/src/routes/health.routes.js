// backend/src/routes/health.routes.js
import express from "express";
import auth from "../middlewares/auth.js";
import {
  addHealthEntry,
  getHealthEntries,
  getStats,
  deleteHealthEntry,
} from "../controllers/health.controller.js";

const router = express.Router();

//  Ajouter une entrée santé
router.post("/", auth, addHealthEntry);

//  Récupérer toutes les entrées santé
router.get("/", auth, getHealthEntries);

// Récupérer les stats par période (week, month, year)
router.get("/stats/:period", auth, getStats);

//  Supprimer une entrée santé
router.delete("/:id", auth, deleteHealthEntry);

export default router;
