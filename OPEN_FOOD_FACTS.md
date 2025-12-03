# 🔍 Intégration Open Food Facts

## Fonctionnalité ajoutée

Une barre de recherche a été intégrée dans le Dashboard pour rechercher des aliments depuis la base de données **Open Food Facts** (plus de 2 millions de produits).

## Fonctionnement

### Backend
- **Route API** : `GET /api/open-food-facts/search?q=<terme>`
- **Fichier** : `backend/src/routes/openFoodFacts.routes.js`
- Recherche dans Open Food Facts et retourne les données nutritionnelles simplifiées
- Filtrage automatique des produits sans données nutritionnelles

### Frontend
- **Composant** : `OpenFoodFactsSearch.jsx`
- **Service** : `openFoodFactsService.js`
- Interface utilisateur moderne avec :
  - Barre de recherche intuitive
  - Affichage des résultats en grille
  - Images des produits
  - Informations nutritionnelles (calories, protéines, glucides, lipides)
  - Bouton d'ajout direct au suivi quotidien

## Utilisation

1. Ouvrez le Dashboard
2. Cliquez sur "Rechercher un aliment (Open Food Facts)"
3. Entrez le nom d'un aliment (ex: "pizza", "pomme", "yaourt")
4. Cliquez sur "Rechercher" ou appuyez sur Entrée
5. Parcourez les résultats et cliquez sur "Ajouter à mon suivi"
6. L'aliment est automatiquement ajouté à votre compteur de calories du jour

## Exemple de recherche

- "poulet" → Résultats de poulet grillé, rôti, etc.
- "pizza" → Différents types de pizza avec leurs valeurs nutritionnelles
- "banane" → Bananes et produits dérivés
- "yaourt nature" → Yaourts natures de différentes marques

## Données récupérées

Pour chaque aliment :
- 🔥 **Calories** (kcal pour 100g)
- 🥚 **Protéines** (g pour 100g)
- 🥤 **Glucides** (g pour 100g)
- 💧 **Lipides** (g pour 100g)
- 🖼️ **Image** du produit (si disponible)

## Avantages

✅ Base de données collaborative mondiale  
✅ Millions de produits référencés  
✅ Données nutritionnelles vérifiées  
✅ Intégration transparente avec votre suivi  
✅ Ajout rapide sans saisie manuelle  

## Notes techniques

- Les résultats sont limités à 20 produits par recherche
- Données pour 100g de produit
- Source : https://world.openfoodfacts.org
- Authentification requise (token JWT)
