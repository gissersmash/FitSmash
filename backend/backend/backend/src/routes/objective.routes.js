// backend/src/routes/objective.routes.js
import { Router } from "express";
import auth from "../middlewares/auth.js";
import { createObjective, listObjectives, updateObjective, deleteObjective } from "../controllers/objective.controller.js";

const router = Router();

router.post("/", auth, createObjective);
router.get("/", auth, listObjectives);
router.put("/:id", auth, updateObjective);
router.delete("/:id", auth, deleteObjective);

export default router;
