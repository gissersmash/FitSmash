import axios from "axios";

const API_URL = "https://world.openfoodfacts.org/api/v2/product";

// Rechercher un aliment par code-barres
export async function getFoodByBarcode(barcode) {
  const res = await axios.get(`${API_URL}/${barcode}.json`);
  if (res.data && res.data.product) {
    const p = res.data.product;
    return {
      name: p.product_name || "Inconnu",
      calories: p.nutriments["energy-kcal_100g"] || 0,
      brand: p.brands || "N/A",
      quantity: "100g", // valeurs nutritionnelles pour 100g
    };
  }
  throw new Error("Produit introuvable");
}

// Rechercher par mot clé (nom d’aliment)
export async function searchFoodsByName(query) {
  const res = await axios.get(
    `https://world.openfoodfacts.org/cgi/search.pl`,
    {
      params: {
        search_terms: query,
        search_simple: 1,
        action: "process",
        json: 1,
        page_size: 10,
      },
    }
  );

  if (res.data && res.data.products) {
    return res.data.products.map((p) => ({
      name: p.product_name || "Inconnu",
      calories: p.nutriments?.["energy-kcal_100g"] || 0,
      brand: p.brands || "N/A",
      quantity: "100g",
    }));
  }
  return [];
}
