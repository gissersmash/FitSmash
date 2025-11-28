// backend/src/controllers/goals.controller.js
import { Goal } from "../models/Goal.js";
import { sequelize } from "../config/db.js";

// Enregistrer plusieurs objectifs nutritionnels
export async function saveNutritionGoals(req, res) {
  const t = await sequelize.transaction(); // Démarrer une transaction
  try {
    const goals = req.body;

    if (!Array.isArray(goals)) {
      return res
        .status(400)
        .json({ message: "Le corps de la requête doit contenir un tableau goals" });
    }

    // Filtrer les objectifs pour ne garder que ceux qui sont valides
    const validGoals = goals.filter(
      (goal) =>
        goal.type &&
        (goal.value !== null && goal.value !== undefined && !isNaN(parseFloat(goal.value)))
    );

    // Supprime les anciens objectifs de l'utilisateur DANS la transaction
    await Goal.destroy({ where: { user_id: req.user.id }, transaction: t });

    // Crée les nouveaux objectifs DANS la transaction
    const created = await Promise.all(
      validGoals.map((goal) => // Utiliser le tableau filtré
        Goal.create({
          user_id: req.user.id,
          type: goal.type,
          value: parseFloat(goal.value), // Assurer la conversion en nombre
          pourcentage: goal.pourcentage || null,
        }, { transaction: t })
      )
    );

    await t.commit(); // Valider la transaction si tout s'est bien passé

    // Retourne bien un objet { goals: [...] }
    res.status(201).json({ goals: created });
  } catch (err) {
    console.error("Erreur lors de l'enregistrement des objectifs:", err); // Log l'erreur complète côté serveur
    await t.rollback(); // Annuler la transaction en cas d'erreur
    // Pour le débogage, vous pouvez renvoyer plus de détails sur l'erreur
    // En production, il est préférable de ne pas exposer les détails internes de l'erreur.
    res.status(400).json({ message: "Erreur lors de l'enregistrement des objectifs.", details: err.message, stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined });
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
