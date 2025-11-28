import axios from "axios";
import { Op } from "sequelize";
import { Food } from "../models/Food.js";

// ✅ Recherche d'aliment par code-barres via Open Food Facts
export async function getFoodByBarcode(req, res) {
  const { code } = req.params;
  try {
    const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Erreur Open Food Facts", error: err.message });
  }
}

// ✅ Rechercher des aliments par nom
export async function searchFoods(req, res) {
  try {
    const { search } = req.query;
    const where = { user_id: req.user.id };
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    const foods = await Food.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json(foods);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ✅ Ajouter un aliment
export async function addFood(req, res) {
  try {
    const { name, calories, quantity, image_url } = req.body;
    const food = await Food.create({
      user_id: req.user.id,
      name,
      calories,
      quantity,
      image_url
    });
    res.status(201).json(food);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ✅ Lister les aliments d'un utilisateur + aliments publics
export async function listFoods(req, res) {
  try {
    const foods = await Food.findAll({
      where: {
        [Op.or]: [
          { user_id: req.user.id },  // Aliments personnels
          { user_id: null }           // Aliments publics
        ]
      },
      order: [["created_at", "DESC"]]
    });
    res.json(foods);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ✅ Supprimer un aliment
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

// ✅ Modifier un aliment (déclaré UNE seule fois)
export async function updateFood(req, res) {
  try {
    const { id } = req.params;
    const { name, calories, quantity, image_url } = req.body;
    const food = await Food.findOne({ where: { id, user_id: req.user.id } });
    if (!food) return res.status(404).json({ message: "Aliment non trouvé" });
    await food.update({ name, calories, quantity, image_url });
    res.json(food);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ✅ Nouvelle route publique : lister tous les aliments
export async function listAllFoods(req, res) {
  try {
    const foods = await Food.findAll({
      order: [["created_at", "DESC"]]
    });
    res.json(foods);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
