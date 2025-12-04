// frontend/src/services/openFoodFactsService.js
import API from "./api";

/**
 * Rechercher des aliments dans Open Food Facts
 * @param {string} query - Le terme de recherche
 * @returns {Promise} - Liste des produits trouvés
 */
export const searchOpenFoodFacts = async (query) => {
  try {
    const response = await API.get(`/open-food-facts/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  searchOpenFoodFacts
};
