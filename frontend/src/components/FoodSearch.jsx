import React, { useState } from 'react';
import { searchFoods } from '../services/foodService';
import { addFoodEntry } from '../services/foodEntryService';
import './FoodSearch.css';

export default function FoodSearch({ onFoodAdded }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setSearchPerformed(true);
    setError(null);
    try {
      const data = await searchFoods(query);
      setResults(data || []);
      
      // Si aucun résultat
      if (!data || data.length === 0) {
        setError(`Aucun résultat pour "${query}". Essayez : pizza, poulet, pomme, banane, pain...`);
      }
    } catch (error) {
      console.error('Erreur recherche:', error);
      setResults([]);
      
      // Message d'erreur personnalisé
      if (error.code === 'ERR_NETWORK') {
        setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
      } else if (error.response?.status === 504) {
        setError('Le serveur met trop de temps à répondre. Essayez : pizza, poulet, pomme, banane, chocolat...');
      } else if (error.response?.status === 404) {
        setError(`Aucun résultat trouvé pour "${query}". Essayez des termes plus courants.`);
      } else {
        setError('Erreur lors de la recherche. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async (food) => {
    try {
      const foodData = {
        food_id: food.id || `ext_${Date.now()}`,
        name: food.name || food.product_name || 'Aliment',
        calories: food.calories || food.nutriments?.['energy-kcal_100g'] || 0,
        proteins: food.proteins || food.nutriments?.proteins_100g || 0,
        carbs: food.carbs || food.nutriments?.carbohydrates_100g || 0,
        fats: food.fats || food.nutriments?.fat_100g || 0,
        image: food.image || food.image_url || '',
        date: new Date().toISOString().split('T')[0]
      };

      await addFoodEntry(foodData);
      alert(`${foodData.name} ajouté avec succès !`);
      
      if (onFoodAdded) {
        onFoodAdded();
      }
    } catch (error) {
      alert('Erreur lors de l\'ajout de l\'aliment');
    }
  };

  return (
    <div className="food-search-container">
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher un aliment (ex: pizza, pomme, pain)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          className="btn-search" 
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Recherche...
            </>
          ) : (
            <>
              <i className="bi bi-search me-2"></i>
              Rechercher
            </>
          )}
        </button>
      </div>

      {loading && (
        <div className="text-center mt-4">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-3">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {!loading && !error && searchPerformed && results.length === 0 && (
        <div className="alert alert-info mt-3">
          <i className="bi bi-info-circle me-2"></i>
          Aucun résultat trouvé pour "{query}". Essayez : pizza, poulet, pomme, banane, pain, chocolat...
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="food-grid mt-4">
          {results.map((food, index) => (
            <div key={food.id || index} className="food-card">
              {(food.image || food.image_url) && (
                <img 
                  src={food.image || food.image_url} 
                  alt={food.name || food.product_name}
                  className="food-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="food-info">
                <h6 className="food-name">{food.name || food.product_name || 'Aliment'}</h6>
                <div className="food-nutrients">
                  <span className="nutrient-badge">
                    <i className="bi bi-fire"></i>
                    {Math.round(food.calories || food.nutriments?.['energy-kcal_100g'] || 0)} kcal
                  </span>
                  <span className="nutrient-badge">
                    <i className="bi bi-egg"></i>
                    {Math.round(food.proteins || food.nutriments?.proteins_100g || 0)}g P
                  </span>
                  <span className="nutrient-badge">
                    <i className="bi bi-cup-straw"></i>
                    {Math.round(food.carbs || food.nutriments?.carbohydrates_100g || 0)}g C
                  </span>
                  <span className="nutrient-badge">
                    <i className="bi bi-droplet"></i>
                    {Math.round(food.fats || food.nutriments?.fat_100g || 0)}g L
                  </span>
                </div>
                <button 
                  className="btn-add"
                  onClick={() => handleAddFood(food)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Ajouter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
