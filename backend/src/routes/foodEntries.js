import express from "express";
import auth from "../middleware/auth.js";
import FoodEntry from "../models/FoodEntry.js";

const router = express.Router();

// Enregistrement des aliments pour l'utilisateur
router.post('/food-entries', auth, async (req, res) => {
  const userId = req.user.id;
  const entries = req.body.entries || [];
  try {
    // Supprime les anciens aliments de l'utilisateur
    await FoodEntry.destroy({ where: { user_id: userId } });
    // Enregistre chaque aliment
    await Promise.all(entries.map(entry => FoodEntry.create({
      user_id: userId,
      name: entry.name,
      calories: entry.calories
    })));
    res.status(200).json({ message: 'Aliments enregistrés' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Récupération des aliments pour l'utilisateur
router.get('/food-entries', auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const entries = await FoodEntry.findAll({ where: { user_id: userId } });
    const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);
    res.json({ entries, totalCalories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
