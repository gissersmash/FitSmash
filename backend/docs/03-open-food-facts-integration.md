# Guide API Open Food Facts - FitSmash

## Vue d'ensemble

L'API FitSmash intègre maintenant **Open Food Facts**, une base de données collaborative de plus de 2 millions de produits alimentaires du monde entier. Tu peux rechercher des aliments réels avec leurs informations nutritionnelles complètes.

---

## Endpoints disponibles

### 1. Rechercher des aliments par nom

**Endpoint :** `GET /api/foods/search?search={query}`

**Authentification :** ❌ Non requise

**Paramètres :**
- `search` (string, required) - Terme de recherche (min 2 caractères)

**Exemple de requête :**
```bash
GET http://localhost:4000/api/foods/search?search=pizza
GET http://localhost:4000/api/foods/search?search=chocolat
GET http://localhost:4000/api/foods/search?search=banane
```

**Réponse :**
```json
[
  {
    "id": "3017620422003",
    "name": "Nutella",
    "brand": "Ferrero",
    "calories": 539,
    "proteins": 6,
    "carbs": 58,
    "fat": 31,
    "image_url": "https://images.openfoodfacts.org/images/products/301/762/042/2003/front_fr.jpg",
    "quantity": 100,
    "source": "openfoodfacts"
  },
  // ... jusqu'à 30 résultats
]
```

**Utilisation dans React :**
```javascript
import api from './api';

export const searchFoods = async (query) => {
  const response = await api.get(`/foods/search?search=${encodeURIComponent(query)}`);
  return response.data;
};

// Dans un composant
const [searchQuery, setSearchQuery] = useState('');
const [results, setResults] = useState([]);

const handleSearch = async () => {
  if (searchQuery.length < 2) return;
  const foods = await searchFoods(searchQuery);
  setResults(foods);
};
```

---

### 2. Obtenir des aliments populaires aléatoires

**Endpoint :** `GET /api/foods/all`

**Authentification :** ❌ Non requise

**Description :** Retourne 30 aliments populaires d'une catégorie aléatoire (fruits, légumes, viandes, produits laitiers, etc.)

**Exemple de requête :**
```bash
GET http://localhost:4000/api/foods/all
```

**Réponse :** Même format que `/search`

**Utilisation dans React :**
```javascript
export const getPopularFoods = async () => {
  const response = await api.get('/foods/all');
  return response.data;
};

// Charger au démarrage du Dashboard
useEffect(() => {
  const loadFoods = async () => {
    const foods = await getPopularFoods();
    setFoods(foods);
  };
  loadFoods();
}, []);
```

---

### 3. Rechercher un aliment par code-barres

**Endpoint :** `GET /api/foods/barcode/:code`

**Authentification :** ❌ Non requise

**Paramètres :**
- `code` (string, required) - Code-barres EAN13 ou UPC

**Exemple de requête :**
```bash
GET http://localhost:4000/api/foods/barcode/3017620422003
```

**Réponse :**
```json
{
  "status": 1,
  "product": {
    "product_name": "Nutella",
    "brands": "Ferrero",
    "nutriments": {
      "energy-kcal_100g": 539,
      "proteins_100g": 6.3,
      "carbohydrates_100g": 57.5,
      "fat_100g": 30.9
    },
    "image_url": "...",
    // ... autres données Open Food Facts
  }
}
```

**Utilisation avec un scanner de code-barres :**
```javascript
import { BarcodeScanner } from 'react-barcode-scanner'; // Exemple

export const getFoodByBarcode = async (barcode) => {
  const response = await api.get(`/foods/barcode/${barcode}`);
  return response.data;
};

const handleScanBarcode = async (barcode) => {
  const data = await getFoodByBarcode(barcode);
  if (data.status === 1) {
    // Produit trouvé
    const product = data.product;
    // Ajouter au journal alimentaire
  } else {
    alert('Produit non trouvé');
  }
};
```

---

## Composant React Complet - Recherche d'Aliments

```javascript
import { useState } from 'react';
import { searchFoods } from '../services/foodService';
import { addFoodEntry } from '../services/foodEntryService';

function FoodSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (query.length < 2) {
      alert('Entrez au moins 2 caractères');
      return;
    }

    setLoading(true);
    try {
      const foods = await searchFoods(query);
      setResults(foods);
    } catch (error) {
      console.error('Erreur recherche:', error);
      alert('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async (food) => {
    try {
      await addFoodEntry({
        food_id: food.id,
        name: `${food.name} ${food.brand ? '- ' + food.brand : ''}`,
        calories: food.calories,
        image: food.image_url,
        date: new Date().toISOString()
      });
      
      alert(`${food.name} ajouté !`);
    } catch (error) {
      console.error('Erreur ajout:', error);
      alert('Erreur lors de l\'ajout');
    }
  };

  return (
    <div className="food-search">
      <h2>🔍 Rechercher un aliment</h2>
      
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher (ex: pizza, chocolat, pomme...)"
          className="search-input"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="results">
          <p className="results-count">
            {results.length} résultat(s) trouvé(s)
          </p>
          
          <div className="food-grid">
            {results.map((food) => (
              <div key={food.id} className="food-card">
                {food.image_url && (
                  <img 
                    src={food.image_url} 
                    alt={food.name}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                
                <div className="food-info">
                  <h4>{food.name}</h4>
                  {food.brand && <p className="brand">{food.brand}</p>}
                  
                  <div className="nutrition">
                    <span className="calories">
                      🔥 {food.calories} kcal
                    </span>
                    <span>🥩 {food.proteins}g protéines</span>
                    <span>🍞 {food.carbs}g glucides</span>
                    <span>🥑 {food.fat}g lipides</span>
                  </div>
                  
                  <p className="quantity">Pour 100g</p>
                </div>
                
                <button 
                  onClick={() => handleAddFood(food)}
                  className="btn-add"
                >
                  ➕ Ajouter
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <p className="no-results">
          Aucun résultat trouvé pour "{query}"
        </p>
      )}
    </div>
  );
}

export default FoodSearch;
```

---

## CSS pour le composant de recherche

```css
.food-search {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 12px 20px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin-right: 10px;
}

.search-input:focus {
  outline: none;
  border-color: #2ecc71;
}

.results-count {
  margin: 20px 0;
  color: #666;
  font-size: 14px;
}

.food-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.food-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
}

.food-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.food-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background: #f5f5f5;
}

.food-info {
  padding: 15px;
}

.food-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
  line-height: 1.4;
}

.brand {
  font-size: 13px;
  color: #999;
  margin: 0 0 10px 0;
}

.nutrition {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 10px 0;
  font-size: 13px;
  color: #666;
}

.calories {
  font-weight: bold;
  font-size: 16px;
  color: #e74c3c;
}

.quantity {
  font-size: 12px;
  color: #999;
  margin: 5px 0 0 0;
}

.btn-add {
  width: 100%;
  padding: 12px;
  background: #2ecc71;
  color: white;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add:hover {
  background: #27ae60;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #999;
}
```

---

## Intégration dans ton Dashboard

Ajoute le composant de recherche dans ton Dashboard existant :

```javascript
import FoodSearch from '../components/FoodSearch';

function Dashboard() {
  // ... ton code existant ...

  return (
    <div className="dashboard">
      {/* ... statistiques existantes ... */}
      
      {/* Nouveau: Section recherche */}
      <FoodSearch />
      
      {/* ... reste du dashboard ... */}
    </div>
  );
}
```

---

## Avantages de l'intégration Open Food Facts

✅ **2+ millions de produits** réels avec codes-barres  
✅ **Informations nutritionnelles complètes** (calories, protéines, glucides, lipides)  
✅ **Photos réelles** des produits  
✅ **Marques et noms officiels**  
✅ **Données mises à jour** par la communauté  
✅ **Gratuit et open source**  
✅ **Support multilingue**  

---

## Exemples de recherches

```javascript
// Recherches courantes
await searchFoods('nutella');
await searchFoods('coca cola');
await searchFoods('pizza');
await searchFoods('banane');
await searchFoods('poulet');
await searchFoods('pain');
await searchFoods('chocolat');
await searchFoods('yaourt');

// Recherche par marque
await searchFoods('herta');
await searchFoods('danone');
await searchFoods('nestle');

// Recherche par catégorie
await searchFoods('fromage');
await searchFoods('pâtes');
await searchFoods('céréales');
```

---

## Gestion des quantités

Par défaut, les valeurs nutritionnelles sont données pour **100g**. Pour ajuster selon une portion différente :

```javascript
const calculateForPortion = (food, portionGrams) => {
  const ratio = portionGrams / 100;
  return {
    ...food,
    calories: Math.round(food.calories * ratio),
    proteins: Math.round(food.proteins * ratio),
    carbs: Math.round(food.carbs * ratio),
    fat: Math.round(food.fat * ratio),
    quantity: portionGrams
  };
};

// Exemple: 50g de Nutella
const nutella = await searchFoods('nutella').then(r => r[0]);
const portion = calculateForPortion(nutella, 50);
// calories: 270 (au lieu de 539)
```

---

## Résumé des Endpoints

| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/api/foods/search?search={query}` | GET | ❌ | Recherche par nom |
| `/api/foods/all` | GET | ❌ | Aliments populaires aléatoires |
| `/api/foods/barcode/:code` | GET | ❌ | Recherche par code-barres |
| `/api/food-entries` | POST | ✅ | Ajouter au journal |
| `/api/food-entries` | GET | ✅ | Lire le journal + calories |
| `/api/food-entries/:id` | DELETE | ✅ | Supprimer une entrée |

---

✅ **Ton API est maintenant connectée à Open Food Facts !**

Tu peux rechercher des millions d'aliments réels et les ajouter à ton journal alimentaire avec leurs vraies informations nutritionnelles.
