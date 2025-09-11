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
import { Goal } from "../models/Goal.js";

// Enregistrer un objectif
export async function createGoal(req, res) {
  try {
    const { goals } = req.body;
    // Enregistre chaque objectif pour l'utilisateur
    const created = await Promise.all(goals.map(goal => Goal.create({
      user_id: req.user.id,
      type: goal.type,
      value: goal.value,
      pourcentage: goal.pourcentage
    })));
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Récupérer les objectifs
export async function listGoals(req, res) {
  try {
    const goals = await Goal.findAll({ where: { user_id: req.user.id } });
    res.json(goals);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
