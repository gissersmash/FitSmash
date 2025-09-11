import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { addFood, listFoods, deleteFood, updateFood } from "../controllers/food.controller.js";
const router = Router();

// Modifier un aliment
router.put("/:id", auth, updateFood);

router.post("/", auth, addFood);      // Ajouter un aliment
router.get("/", auth, listFoods);     // Lister mes aliments
router.delete("/:id", auth, deleteFood); // Supprimer un aliment

export default router;
