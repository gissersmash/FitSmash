import { Router } from "express";
import axios from "axios";
import { auth } from "../middlewares/auth.js";

const router = Router();

// Route pour rechercher des aliments sur Open Food Facts
// GET /api/open-food-facts/search?q=poulet
router.get("/search", auth, async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ message: "Le paramètre de recherche 'q' est requis." });
  }

  // URL de l'API OpenFoodFacts avec pagination et langue française
  // Utilise image_small_url pour des images plus légères (200px max)
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20&fields=product_name,image_small_url,image_thumb_url,nutriments,code`;

  try {
    const apiResponse = await axios.get(url);
    const data = apiResponse.data;

    // On simplifie les résultats pour le frontend
    const simplifiedProducts = (data.products || []).map(p => ({
      id: p.code || `off_${Date.now()}_${Math.random()}`,
      name: p.product_name || 'Produit sans nom',
      calories: Math.round(p.nutriments?.['energy-kcal_100g'] || 0),
      proteins: Math.round((p.nutriments?.proteins_100g || 0) * 10) / 10,
      carbs: Math.round((p.nutriments?.carbohydrates_100g || 0) * 10) / 10,
      fats: Math.round((p.nutriments?.fat_100g || 0) * 10) / 10,
      image: p.image_small_url || p.image_thumb_url || null, // Priorité aux petites images
      source: 'OpenFoodFacts'
    })).filter(p => p.calories > 0 || p.proteins > 0); // Filtrer les produits sans données nutritionnelles

    res.json({ 
      success: true, 
      count: simplifiedProducts.length,
      products: simplifiedProducts 
    });
  } catch (error) {
    console.error("Erreur lors de la recherche Open Food Facts:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Erreur du serveur lors de la recherche.", 
      error: error.message 
    });
  }
});

export default router;
