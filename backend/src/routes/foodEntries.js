import express from "express";
import auth from "../middlewares/auth.js";
import FoodEntry from "../models/FoodEntry.js";
import { sequelize } from "../config/db.js";

const router = express.Router();

// Enregistrement des aliments pour l'utilisateur
router.post('/', auth, async (req, res) => {
  const userId = req.user.id;
  
  try {
    // Vérifier si c'est un tableau d'entrées (ancien format) ou une seule entrée
    if (req.body.entries && Array.isArray(req.body.entries)) {
      // Ancien format: remplacer tous les aliments
      await FoodEntry.destroy({ where: { user_id: userId } });
      await Promise.all(req.body.entries.map(entry => FoodEntry.create({
        user_id: userId,
        name: entry.name,
        calories: entry.calories,
        proteins: entry.proteins || 0,
        carbs: entry.carbs || 0,
        fats: entry.fats || 0,
        image: entry.image || null,
        date: entry.date || new Date().toISOString().split('T')[0]
      })));
      return res.status(200).json({ message: 'Aliments enregistrés' });
    } else {
      // Nouveau format: ajouter un seul aliment
      const { food_id, name, calories, proteins, carbs, fats, image, date, quantity } = req.body;
      
      const newEntry = await FoodEntry.create({
        user_id: userId,
        food_id: food_id || null,
        name: name || 'Aliment',
        calories: Number(calories) || 0,
        proteins: Number(proteins) || 0,
        carbs: Number(carbs) || 0,
        fats: Number(fats) || 0,
        quantity: Number(quantity) || 100,
        image: image || null,
        date: date || new Date().toISOString().split('T')[0]
      });
      
      console.log('✅ Aliment ajouté:', newEntry.name, '-', newEntry.calories, 'kcal pour', newEntry.quantity, 'g');
      
      return res.status(201).json({ 
        success: true,
        message: 'Aliment ajouté avec succès',
        entry: newEntry 
      });
    }
  } catch (err) {
    console.error('❌ Erreur ajout food entry:', err);
    return res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});
sequelize.sync({ alter: true })
  .then(() => console.log("✅ Tables synchronisées"))
  .catch(err => console.error("❌ Erreur sync:", err));


// Récupération des aliments pour l'utilisateur
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const entries = await FoodEntry.findAll({ where: { user_id: userId } });
    const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);
    res.json({ entries, totalCalories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Suppression d'un aliment spécifique
router.delete('/:id', auth, async (req, res) => {
  const userId = req.user.id;
  const entryId = req.params.id;
  
  try {
    const entry = await FoodEntry.findOne({ 
      where: { 
        id: entryId,
        user_id: userId 
      } 
    });
    
    if (!entry) {
      return res.status(404).json({ 
        success: false,
        message: 'Aliment non trouvé ou vous n\'avez pas les droits' 
      });
    }
    
    await entry.destroy();
    
    console.log(`✅ Aliment supprimé: ${entry.name} (ID: ${entryId})`);
    
    res.json({ 
      success: true,
      message: 'Aliment supprimé avec succès' 
    });
  } catch (err) {
    console.error('❌ Erreur suppression food entry:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

export default router;
