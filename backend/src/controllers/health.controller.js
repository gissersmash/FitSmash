// backend/src/controllers/health.controller.js
import HealthEntry from "../models/HealthEntry.js";

// ➕ Ajouter une entrée santé
export async function addHealthEntry(req, res) {
  try {
    const { poids, sommeil, activite, date } = req.body;

    const entry = await HealthEntry.create({
      user_id: req.user.id,
      poids,
      sommeil,
      activite,
      date: date || new Date()
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// 📋 Récupérer toutes les entrées santé de l’utilisateur
export async function listHealthEntries(req, res) {
  try {
    const entries = await HealthEntry.findAll({
      where: { user_id: req.user.id },
      order: [["date", "ASC"]],
    });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
