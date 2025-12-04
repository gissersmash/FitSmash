import { Router } from "express";
import { getActivities, addActivity, deleteActivity, getActivityTypes, searchActivities } from "../controllers/activity.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

// GET /api/activities/search - Rechercher des activités via API Ninjas (DOIT ÊTRE AVANT /)
router.get("/search", auth, searchActivities);

// GET /api/activities/types - Liste des types d'activités disponibles
router.get("/types", auth, getActivityTypes);

// GET /api/activities - Liste des activités de l'utilisateur
router.get("/", auth, getActivities);

// POST /api/activities - Ajouter une activité
router.post("/", auth, addActivity);

// DELETE /api/activities/:id - Supprimer une activité
router.delete("/:id", auth, deleteActivity);

export default router;
