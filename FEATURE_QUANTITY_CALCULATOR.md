# 🧮 Fonctionnalité : Calculateur de Quantité et Ajustement des Valeurs Nutritionnelles

## 📋 Vue d'ensemble

Cette fonctionnalité permet aux utilisateurs d'ajuster manuellement la quantité d'un aliment et de voir les valeurs nutritionnelles se recalculer automatiquement en temps réel.

---

## 🛠️ Technologies et Concepts Utilisés

### 1. **React Hooks - useState**
- **Fichier** : `frontend/src/components/OpenFoodFactsSearch.jsx`
- **Utilisation** : Gestion de l'état local pour stocker les quantités de chaque aliment

```javascript
const [quantities, setQuantities] = useState({}); // État pour stocker les quantités
```

**Pourquoi ?** 
- Permet de maintenir un état séparé pour chaque aliment
- Réactivité automatique : l'interface se met à jour dès qu'une quantité change

---

### 2. **Calcul Proportionnel (Règle de Trois)**
- **Fonction** : `calculateNutrients(food, quantity)`
- **Formule** : `valeur_ajustée = (valeur_pour_100g × quantité_saisie) / 100`

```javascript
const calculateNutrients = (food, quantity) => {
  const ratio = quantity / 100;  // Ratio par rapport à 100g
  return {
    calories: Math.round(food.calories * ratio),
    proteins: Math.round((food.proteins * ratio) * 10) / 10,
    carbs: Math.round((food.carbs * ratio) * 10) / 10,
    fats: Math.round((food.fats * ratio) * 10) / 10
  };
};
```

**Exemple concret :**
- Base : Pizza = 250 kcal pour 100g
- Utilisateur saisit : 150g
- Calcul : 250 × (150 / 100) = **375 kcal**

---

### 3. **Gestion d'État par Identifiant (State Management)**
- **Fonction** : `handleQuantityChange(foodId, value)`

```javascript
const handleQuantityChange = (foodId, value) => {
  setQuantities(prev => ({
    ...prev,
    [foodId]: value  // Mise à jour uniquement de l'aliment concerné
  }));
};
```

**Concept :** 
- Objet clé-valeur où chaque aliment a sa propre quantité
- Utilise l'ID unique de l'aliment comme clé
- Spread operator (`...prev`) pour préserver les autres valeurs

**Structure de données :**
```javascript
quantities = {
  "3017620422003": 150,  // Pizza - 150g
  "3274080005003": 200,  // Yaourt - 200g
  "3560070638253": 100   // Pomme - 100g
}
```

---

### 4. **Rendu Conditionnel et Calcul à la Volée**
- **Technique** : Calcul dans le render (pas de state séparé)

```javascript
{results.map((food, idx) => {
  const quantity = getQuantity(food.id);           // Récupère la quantité
  const adjustedNutrients = calculateNutrients(food, quantity);  // Calcule
  
  return (
    <div>
      <span>{adjustedNutrients.calories} kcal</span>  {/* Affiche */}
    </div>
  );
})}
```

**Avantages :**
- Recalcul automatique à chaque changement
- Pas de synchronisation complexe entre états
- Performance optimale (React optimise le re-render)

---

### 5. **Controlled Components (Composants Contrôlés)**
- **Input contrôlé** : La valeur vient de l'état React

```javascript
<input
  type="number"
  value={quantity}                    // ← État React (source de vérité)
  onChange={(e) => handleQuantityChange(food.id, parseInt(e.target.value))}
  min="1"
/>
```

**Flux de données :**
1. L'utilisateur tape "150" dans l'input
2. `onChange` déclenche `handleQuantityChange`
3. L'état `quantities` est mis à jour
4. React re-render le composant
5. Le calcul `calculateNutrients` s'exécute avec la nouvelle valeur
6. L'affichage est mis à jour avec les nouvelles valeurs

---

### 6. **Boutons d'Incrémentation/Décrémentation**

```javascript
<button onClick={() => handleQuantityChange(food.id, quantity - 10)}>
  <i className="bi bi-dash"></i>
</button>

<button onClick={() => handleQuantityChange(food.id, quantity + 10)}>
  <i className="bi bi-plus"></i>
</button>
```

**Validation :**
```javascript
Math.max(1, quantity - 10)  // Empêche les valeurs négatives
```

---

### 7. **Boutons de Quantités Rapides (Presets)**

```javascript
const quickQuantities = [50, 100, 150, 200];

<button 
  className={quantity === 100 ? styles.quickBtnActive : ''}
  onClick={() => handleQuantityChange(food.id, 100)}
>
  100g
</button>
```

**CSS Dynamique :**
- Classe conditionnelle pour mettre en évidence le bouton actif
- Utilise l'opérateur ternaire pour appliquer le style

---

### 8. **Transmission de Données Enrichies au Parent**

```javascript
const handleAddFood = async (food) => {
  const quantity = getQuantity(food.id);
  const adjustedNutrients = calculateNutrients(food, quantity);
  
  const adjustedFood = {
    ...food,                           // Données originales
    calories: adjustedNutrients.calories,   // Valeurs recalculées
    proteins: adjustedNutrients.proteins,
    carbs: adjustedNutrients.carbs,
    fats: adjustedNutrients.fats,
    quantity: quantity                 // Quantité ajoutée
  };
  
  await onFoodAdd(adjustedFood);  // Envoi au parent (Dashboard)
};
```

**Concept :** 
- Le composant enfant enrichit les données avant de les passer au parent
- Le parent reçoit un objet prêt à être sauvegardé

---

### 9. **Validation des Entrées Utilisateur**

```javascript
onChange={(e) => handleQuantityChange(
  food.id, 
  Math.max(1, parseInt(e.target.value) || 1)  // Validation
)}
```

**Protections :**
- `parseInt()` : Convertit la chaîne en nombre
- `|| 1` : Valeur par défaut si NaN
- `Math.max(1, ...)` : Minimum de 1g

---

### 10. **Backend - Nouveau Champ dans le Modèle**

**Fichier** : `backend/src/models/FoodEntry.js`

```javascript
const FoodEntry = sequelize.define("FoodEntry", {
  // ... autres champs
  quantity: { 
    type: DataTypes.FLOAT, 
    allowNull: true, 
    defaultValue: 100 
  },
});
```

**Migration automatique :**
- `sequelize.sync({ alter: true })` ajoute la colonne automatiquement
- Pas besoin de migration manuelle

---

### 11. **Backend - Route API Modifiée**

**Fichier** : `backend/src/routes/foodEntries.js`

```javascript
const { food_id, name, calories, proteins, carbs, fats, image, date, quantity } = req.body;

const newEntry = await FoodEntry.create({
  // ... autres champs
  quantity: Number(quantity) || 100,
});

console.log('✅ Aliment ajouté:', newEntry.name, '-', newEntry.calories, 'kcal pour', newEntry.quantity, 'g');
```

---

## 🎯 Flux Complet de Données

```
1. USER INPUT
   └─> Utilisateur change la quantité (150g)
        
2. STATE UPDATE
   └─> quantities[foodId] = 150
        
3. RE-RENDER
   └─> React détecte le changement d'état
        
4. CALCULATION
   └─> calculateNutrients(food, 150)
   └─> Calories: 250 × 1.5 = 375 kcal
        
5. UI UPDATE
   └─> Affichage mis à jour: "375 kcal"
   └─> Label: "Valeurs pour 150g"
        
6. ADD TO TRACKING
   └─> Clic sur "Ajouter 150g"
   └─> handleAddFood enrichit l'objet
        
7. BACKEND SAVE
   └─> POST /api/food-entries
   └─> { name: "Pizza", calories: 375, quantity: 150 }
        
8. DATABASE
   └─> INSERT INTO FoodEntries (name, calories, quantity, ...)
```

---

## 🧪 Formules Mathématiques

### Règle de Trois Proportionnelle

**Formule générale :**
```
Si 100g = X kcal
Alors Yg = (X × Y) / 100 kcal
```

**Exemples :**
```
Poulet: 165 kcal/100g
→ 200g = (165 × 200) / 100 = 330 kcal

Banane: 89 kcal/100g  
→ 120g = (89 × 120) / 100 = 106.8 kcal

Pizza: 266 kcal/100g
→ 50g = (266 × 50) / 100 = 133 kcal
```

---

## 📊 Arrondis et Précision

```javascript
// Calories (entier)
calories: Math.round(food.calories * ratio)

// Macronutriments (1 décimale)
proteins: Math.round((food.proteins * ratio) * 10) / 10
```

**Explication :**
- `* 10` : Décale la décimale (12.567 → 125.67)
- `Math.round()` : Arrondit (125.67 → 126)
- `/ 10` : Replace la décimale (126 → 12.6)

---

## 🎨 Styles CSS Utilisés

### Animation au Hover
```css
.nutrientBadge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(30, 194, 135, 0.2);
}
```

### Boutons avec Gradient
```css
.quantityBtn {
  background: linear-gradient(135deg, #1ec287 0%, #16a970 100%);
}
```

### État Actif
```css
.quickBtnActive {
  background: linear-gradient(135deg, #1ec287 0%, #16a970 100%);
  color: white;
}
```

---

## 📦 Structure des Fichiers Modifiés

```
frontend/
├── src/
│   ├── components/
│   │   └── OpenFoodFactsSearch.jsx    ← Logique principale
│   ├── styles/
│   │   └── OpenFoodFactsSearch.module.css    ← Styles
│   └── pages/
│       └── Dashboard.jsx    ← Intégration

backend/
├── src/
│   ├── models/
│   │   └── FoodEntry.js    ← Ajout champ quantity
│   └── routes/
│       └── foodEntries.js    ← Route mise à jour
```

---

## 🚀 Points Clés de Performance

1. **Calcul à la volée** : Pas de state supplémentaire pour les valeurs calculées
2. **Mémoization implicite** : React optimise automatiquement
3. **Updates ciblées** : Seul l'aliment modifié est recalculé
4. **Input type="number"** : Validation HTML native

---

## 💡 Améliorations Possibles (Futures)

1. **Unités alternatives** : ml, portions, pièces
2. **Historique des portions** : Mémoriser les portions fréquentes
3. **Suggestions intelligentes** : Portions recommandées par aliment
4. **Graphique visuel** : Barre de progression des calories
5. **Favoris** : Sauvegarder les combinaisons aliment+quantité

---

## 📚 Concepts React Appris

✅ **State Management** : useState avec objets complexes  
✅ **Computed Values** : Calculs dérivés de l'état  
✅ **Controlled Components** : Synchronisation input/state  
✅ **Props Callback** : Communication enfant → parent  
✅ **Conditional Rendering** : Classes CSS dynamiques  
✅ **Array Methods** : map() avec calculs  
✅ **Spread Operator** : Immutabilité des objets  
✅ **Event Handlers** : onChange, onClick  

---

## 🎓 Bonnes Pratiques Appliquées

✅ Validation des entrées utilisateur  
✅ Valeurs par défaut sécurisées  
✅ Feedback visuel immédiat  
✅ Code réutilisable (fonctions pures)  
✅ Logs pour le debugging  
✅ UI responsive et accessible  
✅ Noms de variables explicites  

---

**Créé le :** 3 décembre 2025  
**Technologies :** React, Node.js, Sequelize, MySQL, CSS Modules  
**Complexité :** Intermédiaire  
**Temps d'implémentation :** ~2h
