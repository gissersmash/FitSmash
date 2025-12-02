import { Router } from "express";
import authRoutes from "./auth.routes.js";
import healthRoutes from "./health.routes.js";
import objectiveRoutes from "./objective.routes.js";
import foodRoutes from "./food.routes.js";
import goalsRoutes from "./goals.routes.js";
import foodEntriesRouter from "./foodEntries.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/health", healthRoutes);
router.use("/objectives", objectiveRoutes);
router.use("/foods", foodRoutes);
router.use("/goals", goalsRoutes);
router.use("/food-entries", foodEntriesRouter);

export default router;
