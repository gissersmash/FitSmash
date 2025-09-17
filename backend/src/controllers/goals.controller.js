// backend/src/controllers/goals.controller.js
import { Goal } from "../models/Goal.js";

// Enregistrer plusieurs objectifs nutritionnels
export async function saveNutritionGoals(req, res) {
  try {
    const { goals } = req.body;

    if (!Array.isArray(goals)) {
      return res.status(400).json({ message: "Le corps de la requête doit contenir un tableau goals" });
    }

    // Supprime les anciens objectifs de l'utilisateur
    await Goal.destroy({ where: { user_id: req.user.id } });

    // Crée les nouveaux objectifs
    const created = await Promise.all(
      goals.map(goal =>
        Goal.create({
          user_id: req.user.id,
          type: goal.type,
          value: goal.objectif // correspond au frontend
        })
      )
    );

    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Récupérer tous les objectifs d'un utilisateur
export async function listGoals(req, res) {
  try {
    const goals = await Goal.findAll({ where: { user_id: req.user.id } });
    res.json(goals);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Modifier un objectif
export async function updateGoal(req, res) {
  try {
    const { id } = req.params;
    const { type, value } = req.body;

    const goal = await Goal.findOne({ where: { id, user_id: req.user.id } });
    if (!goal) return res.status(404).json({ message: "Objectif non trouvé" });

    await goal.update({ type, value });
    res.json(goal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Supprimer un objectif
export async function deleteGoal(req, res) {
  try {
    const { id } = req.params;

    const goal = await Goal.findOne({ where: { id, user_id: req.user.id } });
    if (!goal) return res.status(404).json({ message: "Objectif non trouvé" });

    await goal.destroy();
    res.json({ message: "Objectif supprimé" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
