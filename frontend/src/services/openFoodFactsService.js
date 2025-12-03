// frontend/src/services/openFoodFactsService.js
import API from "./api";

/**
 * Rechercher des aliments dans Open Food Facts
 * @param {string} query - Le terme de recherche
 * @returns {Promise} - Liste des produits trouvés
 */
export const searchOpenFoodFacts = async (query) => {
  try {
    console.log('🔍 Recherche Open Food Facts pour:', query);
    console.log('📡 URL complète:', API.defaults.baseURL + `/open-food-facts/search?q=${encodeURIComponent(query)}`);
    
    const response = await API.get(`/open-food-facts/search?q=${encodeURIComponent(query)}`);
    
    console.log('✅ Réponse reçue:', response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur recherche Open Food Facts:", error);
    console.error("📄 Détails:", error.response?.data);
    console.error("🔢 Status:", error.response?.status);
    console.error("🔗 URL:", error.config?.url);
    throw error;
  }
};

export default {
  searchOpenFoodFacts
};
