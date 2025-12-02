import React, { useState } from 'react';
import { searchFoods } from '../services/foodService';
import { addFoodEntry } from '../services/foodEntryService';
import './FoodSearch.css';

export default function FoodSearch({ onFoodAdded }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setSearchPerformed(true);
    try {
      const data = await searchFoods(query);
      setResults(data || []);
    } catch (error) {
      console.error('Erreur recherche:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async (food) => {
    try {
      const foodData = {
        food_id: food.id || `ext_${Date.now()}`,
        name: food.product_name || food.name || 'Aliment',
        calories: food.nutriments?.['energy-kcal_100g'] || food.calories || 0,
        proteins: food.nutriments?.proteins_100g || food.proteins || 0,
        carbs: food.nutriments?.carbohydrates_100g || food.carbs || 0,
        fats: food.nutriments?.fat_100g || food.fats || 0,
        image: food.image_url || food.image || '',
        date: new Date().toISOString().split('T')[0]
      };

      await addFoodEntry(foodData);
      alert(`${foodData.name} ajouté avec succès !`);
      
      if (onFoodAdded) {
        onFoodAdded();
      }
    } catch (error) {
      console.error('Erreur ajout aliment:', error);
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

      {!loading && searchPerformed && results.length === 0 && (
        <div className="alert alert-info mt-3">
          <i className="bi bi-info-circle me-2"></i>
          Aucun résultat trouvé pour "{query}"
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="food-grid mt-4">
          {results.map((food, index) => (
            <div key={food.id || index} className="food-card">
              {food.image_url && (
                <img 
                  src={food.image_url} 
                  alt={food.product_name}
                  className="food-image"
                />
              )}
              <div className="food-info">
                <h6 className="food-name">{food.product_name || 'Aliment'}</h6>
                <div className="food-nutrients">
                  <span className="nutrient-badge">
                    <i className="bi bi-fire"></i>
                    {Math.round(food.nutriments?.['energy-kcal_100g'] || 0)} kcal
                  </span>
                  <span className="nutrient-badge">
                    <i className="bi bi-egg"></i>
                    {Math.round(food.nutriments?.proteins_100g || 0)}g P
                  </span>
                  <span className="nutrient-badge">
                    <i className="bi bi-cup-straw"></i>
                    {Math.round(food.nutriments?.carbohydrates_100g || 0)}g C
                  </span>
                  <span className="nutrient-badge">
                    <i className="bi bi-droplet"></i>
                    {Math.round(food.nutriments?.fat_100g || 0)}g L
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
