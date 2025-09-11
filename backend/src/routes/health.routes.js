import { Router } from "express";
import { auth } from "../middleware/auth.js";
const router = Router();

import { createEntry, listEntries, updateEntry, deleteEntry } from "../controllers/health.controller.js";

// PUT /api/health/:id → Modifier une entrée santé
router.put("/:id", auth, updateEntry);

// DELETE /api/health/:id → Supprimer une entrée santé
router.delete("/:id", auth, deleteEntry);

// POST /api/health → Ajouter une entrée santé
router.post("/", auth, createEntry);

// GET /api/health → Récupérer les entrées santé
router.get("/", auth, listEntries);

export default router;
