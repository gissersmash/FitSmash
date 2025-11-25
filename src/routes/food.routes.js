import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { addFood, listFoods, deleteFood, updateFood, listAllFoods } from "../controllers/food.controller.js";


const router = Router();

// Modifier un aliment
router.put("/:id", auth, updateFood);

router.post("/", auth, addFood);        // Ajouter un aliment
router.get("/", auth, listFoods);       // Lister mes aliments
router.delete("/:id", auth, deleteFood); // Supprimer un aliment

// Nouvelle route publique : liste complète des aliments
router.get("/all", listAllFoods);

export default router;
