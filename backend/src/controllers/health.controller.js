// backend/src/controllers/health.controller.js
import HealthEntry from "../models/HealthEntry.js";
import { Op } from "sequelize";

// ➕ Ajouter une entrée santé
export async function addHealthEntry(req, res) {
  try {
    const { weight, sleep, activity, date, activity_type } = req.body;

    const entry = await HealthEntry.create({
      user_id: req.user.id, // l'ID vient du middleware auth
      weight,
      sleep,
      activity: activity || 0, // Valeur par défaut 0 si non fourni
      date: new Date(date),
      activity_type: activity_type || null, // Optionnel
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error("Erreur addHealthEntry:", err);
    res.status(500).json({ message: err.message });
  }
}

//  Récupérer toutes les entrées santé de l’utilisateur
export async function getHealthEntries(req, res) {
  try {
    const entries = await HealthEntry.findAll({
      where: { user_id: req.user.id },
      order: [["date", "ASC"]],
    });

    res.json(entries);
  } catch (err) {
    console.error("Erreur getHealthEntries:", err);
    res.status(500).json({ message: err.message });
  }
}

//  Récupérer les stats par période (week, month, year)
export async function getStats(req, res) {
  try {
    const { period } = req.params;
    const now = new Date();
    let startDate;

    if (period === "week") {
      const day = now.getDay();
      startDate = new Date(now);
      startDate.setDate(now.getDate() - day);
    } else if (period === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      return res.status(400).json({ message: "Période invalide" });
    }

    const entries = await HealthEntry.findAll({
      where: {
        user_id: req.user.id,
        date: { [Op.gte]: startDate },
      },
      order: [["date", "ASC"]],
    });

    res.json(entries);
  } catch (err) {
    console.error("Erreur getStats:", err);
    res.status(500).json({ message: err.message });
  }
}
//  Supprimer une entrée
export async function deleteHealthEntry(req, res) {
  try {
    const { id } = req.params;
    const entry = await HealthEntry.findOne({
      where: { id, user_id: req.user.id },
    });

    if (!entry) return res.status(404).json({ message: "Entrée non trouvée" });

    await entry.destroy();
    res.json({ message: "Entrée supprimée" });
  } catch (err) {
    console.error("Erreur deleteHealthEntry:", err);
    res.status(500).json({ message: err.message });
  }
}
