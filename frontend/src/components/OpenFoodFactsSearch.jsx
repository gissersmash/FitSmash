// frontend/src/components/OpenFoodFactsSearch.jsx
import { useState } from 'react';
import { searchOpenFoodFacts } from '../services/openFoodFactsService';
import styles from '../styles/OpenFoodFactsSearch.module.css';

export default function OpenFoodFactsSearch({ onFoodAdd }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({}); // Stocke les quantités pour chaque aliment

  const handleQuantityChange = (foodId, value) => {
    setQuantities(prev => ({
      ...prev,
      [foodId]: value
    }));
  };

  const getQuantity = (foodId) => {
    return quantities[foodId] || 100; // Par défaut 100g
  };

  const calculateNutrients = (food, quantity) => {
    const ratio = quantity / 100;
    return {
      calories: Math.round(food.calories * ratio),
      proteins: Math.round((food.proteins * ratio) * 10) / 10,
      carbs: Math.round((food.carbs * ratio) * 10) / 10,
      fats: Math.round((food.fats * ratio) * 10) / 10
    };
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    
    if (!query.trim()) {
      alert('Veuillez entrer un terme de recherche');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data = await searchOpenFoodFacts(query);
      setResults(data.products || []);
      
      if ((data.products || []).length === 0) {
        setError(`Aucun résultat pour "${query}"`);
      }
    } catch (err) {
      setError('Erreur lors de la recherche. Veuillez réessayer.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async (food) => {
    try {
      if (onFoodAdd) {
        const quantity = getQuantity(food.id);
        const adjustedNutrients = calculateNutrients(food, quantity);
        
        // Créer un objet aliment avec les valeurs ajustées
        const adjustedFood = {
          ...food,
          calories: adjustedNutrients.calories,
          proteins: adjustedNutrients.proteins,
          carbs: adjustedNutrients.carbs,
          fats: adjustedNutrients.fats,
          quantity: quantity
        };
        
        await onFoodAdd(adjustedFood);
      }
    } catch (error) {
      // Erreur silencieuse
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchHeader}>
        <div className={styles.searchHeaderContent}>
          <div className={styles.searchIconWrapper}>
            <i className="bi bi-search"></i>
          </div>
          <div>
            <h5 className={styles.searchTitle}>Rechercher un aliment</h5>
            <p className={styles.searchSubtitle}>Catalogue des aliments - Des millions de produits</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.searchInputGroup}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Ex: Pomme, Pizza, Yaourt nature..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button 
            type="submit"
            className={styles.searchButton}
            disabled={loading || !query.trim()}
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
      </form>

      {loading && (
        <div className={styles.loadingState}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className={styles.loadingText}>Recherche en cours...</p>
        </div>
      )}

      {error && !loading && (
        <div className={styles.errorState}>
          <i className="bi bi-info-circle me-2"></i>
          {error}
        </div>
      )}

      {!loading && searched && results.length > 0 && (
        <div className={styles.resultsContainer}>
          <div className={styles.resultsHeader}>
            <i className="bi bi-check-circle-fill me-2"></i>
            {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
          </div>

          <div className={styles.legendBox}>
            <div className={styles.legendTitle}>
              <i className="bi bi-info-circle-fill me-2"></i>
              Légende des informations nutritionnelles
            </div>
            <div className={styles.legendItems}>
              <div className={styles.legendItem}>
                <i className="bi bi-fire" style={{color: '#1ec287'}}></i>
                <span>Calories (énergie)</span>
              </div>
              <div className={styles.legendItem}>
                <i className="bi bi-egg" style={{color: '#1ec287'}}></i>
                <span>Protéines</span>
              </div>
              <div className={styles.legendItem}>
                <i className="bi bi-cup-straw" style={{color: '#1ec287'}}></i>
                <span>Glucides</span>
              </div>
              <div className={styles.legendItem}>
                <i className="bi bi-droplet" style={{color: '#1ec287'}}></i>
                <span>Lipides (graisses)</span>
              </div>
            </div>
            <p className={styles.legendNote}>
              ℹ️ Les valeurs de base sont pour 100g - Ajustez la quantité pour recalculer automatiquement
            </p>
          </div>
          
          <div className={styles.resultsGrid}>
            {results.map((food, idx) => {
              const quantity = getQuantity(food.id);
              const adjustedNutrients = calculateNutrients(food, quantity);
              
              return (
              <div key={food.id || idx} className={styles.foodCard}>
                <div className={styles.foodCardImage}>
                  {food.image ? (
                    <img src={food.image} alt={food.name} />
                  ) : (
                    <div className={styles.noImage}>
                      <i className="bi bi-image"></i>
                    </div>
                  )}
                </div>
                
                <div className={styles.foodCardContent}>
                  <h6 className={styles.foodName}>{food.name}</h6>
                  
                  <div className={styles.quantityControl}>
                    <label className={styles.quantityLabel}>
                      <i className="bi bi-calculator me-1"></i>
                      Quantité (grammes) :
                    </label>
                    <div className={styles.quantityInputGroup}>
                      <button 
                        className={styles.quantityBtn}
                        onClick={() => handleQuantityChange(food.id, Math.max(1, quantity - 10))}
                        type="button"
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input
                        type="number"
                        className={styles.quantityInput}
                        value={quantity}
                        onChange={(e) => handleQuantityChange(food.id, Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        step="10"
                      />
                      <button 
                        className={styles.quantityBtn}
                        onClick={() => handleQuantityChange(food.id, quantity + 10)}
                        type="button"
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                    <div className={styles.quickQuantities}>
                      <button 
                        className={`${styles.quickBtn} ${quantity === 50 ? styles.quickBtnActive : ''}`}
                        onClick={() => handleQuantityChange(food.id, 50)}
                        type="button"
                      >
                        50g
                      </button>
                      <button 
                        className={`${styles.quickBtn} ${quantity === 100 ? styles.quickBtnActive : ''}`}
                        onClick={() => handleQuantityChange(food.id, 100)}
                        type="button"
                      >
                        100g
                      </button>
                      <button 
                        className={`${styles.quickBtn} ${quantity === 150 ? styles.quickBtnActive : ''}`}
                        onClick={() => handleQuantityChange(food.id, 150)}
                        type="button"
                      >
                        150g
                      </button>
                      <button 
                        className={`${styles.quickBtn} ${quantity === 200 ? styles.quickBtnActive : ''}`}
                        onClick={() => handleQuantityChange(food.id, 200)}
                        type="button"
                      >
                        200g
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.nutritionInfo}>
                    <p className={styles.nutritionLabel}>
                      Valeurs nutritionnelles pour {quantity}g :
                    </p>
                  </div>
                  
                  <div className={styles.nutrientsGrid}>
                    <div className={styles.nutrientBadge} title="Calories">
                      <i className="bi bi-fire"></i>
                      <div className={styles.nutrientInfo}>
                        <span className={styles.nutrientValue}>{adjustedNutrients.calories}</span>
                        <span className={styles.nutrientUnit}>kcal</span>
                      </div>
                    </div>
                    <div className={styles.nutrientBadge} title="Protéines">
                      <i className="bi bi-egg"></i>
                      <div className={styles.nutrientInfo}>
                        <span className={styles.nutrientValue}>{adjustedNutrients.proteins}g</span>
                        <span className={styles.nutrientUnit}>Protéines</span>
                      </div>
                    </div>
                    <div className={styles.nutrientBadge} title="Glucides">
                      <i className="bi bi-cup-straw"></i>
                      <div className={styles.nutrientInfo}>
                        <span className={styles.nutrientValue}>{adjustedNutrients.carbs}g</span>
                        <span className={styles.nutrientUnit}>Glucides</span>
                      </div>
                    </div>
                    <div className={styles.nutrientBadge} title="Lipides">
                      <i className="bi bi-droplet"></i>
                      <div className={styles.nutrientInfo}>
                        <span className={styles.nutrientValue}>{adjustedNutrients.fats}g</span>
                        <span className={styles.nutrientUnit}>Lipides</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    className={styles.addButton}
                    onClick={() => handleAddFood(food)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Ajouter {quantity}g à mon suivi
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
