// backend/src/routes/health.routes.js
import express from "express";
import auth from "../middlewares/auth.js";
import { addHealthEntry, listHealthEntries } from "../controllers/health.controller.js";

const router = express.Router();

// Ajouter une entrée santé
router.post("/", auth, addHealthEntry);

// Récupérer toutes les entrées santé
router.get("/", auth, listHealthEntries);

export default router;
