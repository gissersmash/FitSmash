// Modifier un aliment
export async function updateFood(req, res) {
  try {
    const { id } = req.params;
    const { name, calories, quantity } = req.body;
    const food = await Food.findOne({ where: { id, user_id: req.user.id } });
    if (!food) return res.status(404).json({ message: "Aliment non trouvé" });
    await food.update({ name, calories, quantity });
    res.json(food);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
import { Food } from "../models/Food.js";

// Ajouter un aliment
export async function addFood(req, res) {
  try {
    const { name, calories, quantity } = req.body;
    const food = await Food.create({
      user_id: req.user.id,
      name,
      calories,
      quantity
    });
    res.status(201).json(food);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Lister les aliments d’un utilisateur
export async function listFoods(req, res) {
  try {
    const foods = await Food.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]]
    });
    res.json(foods);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Supprimer un aliment
export async function deleteFood(req, res) {
  try {
    const { id } = req.params;
    const food = await Food.findOne({ where: { id, user_id: req.user.id } });
    if (!food) return res.status(404).json({ message: "Aliment non trouvé" });
    await food.destroy();
    res.json({ message: "Aliment supprimé" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
