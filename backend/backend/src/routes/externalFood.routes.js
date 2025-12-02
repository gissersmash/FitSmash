// backend/src/routes/externalFood.routes.js
import { Router } from "express";
import fetch from "node-fetch"; // Assurez-vous d'installer node-fetch: npm install node-fetch
import { auth } from "../middlewares/auth.js";

const router = Router();

// Route pour rechercher des aliments sur une API externe (OpenFoodFacts)
// GET /api/external-food/search?q=poulet
router.get("/search", auth, async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ message: "Le paramètre de recherche 'q' est requis." });
  }

  // URL de l'API OpenFoodFacts
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`;

  try {
    const apiResponse = await fetch(url);
    const data = await apiResponse.json();

    // On simplifie les résultats pour le frontend
    const simplifiedProducts = data.products.map(p => ({
      name: p.product_name,
      calories: p.nutriments['energy-kcal_100g'] || 0,
      proteins: p.nutriments.proteins_100g || 0,
      carbs: p.nutriments.carbohydrates_100g || 0,
      fats: p.nutriments.fat_100g || 0,
    }));

    res.json(simplifiedProducts);
  } catch (error) {
    console.error("Erreur lors de la recherche d'aliments externes:", error);
    res.status(500).json({ message: "Erreur du serveur lors de la recherche." });
  }
});

export default router;