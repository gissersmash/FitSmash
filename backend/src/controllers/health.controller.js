// Modifier une entrée santé
export async function updateEntry(req, res) {
  try {
    const { id } = req.params;
    const { weight, sleep_hours, activity_minutes, created_at } = req.body;
    const entry = await HealthData.findOne({ where: { id, user_id: req.user.id } });
    if (!entry) return res.status(404).json({ message: "Entrée non trouvée" });
    await entry.update({ weight, sleep_hours, activity_minutes, created_at });
    return res.json(entry);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// Supprimer une entrée santé
export async function deleteEntry(req, res) {
  try {
    const { id } = req.params;
    const entry = await HealthData.findOne({ where: { id, user_id: req.user.id } });
    if (!entry) return res.status(404).json({ message: "Entrée non trouvée" });
    await entry.destroy();
    return res.json({ message: "Entrée supprimée" });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}
import { HealthData } from "../models/HealthData.js";

// Ajouter une entrée santé
export async function createEntry(req, res) {
  try {
    const { weight, sleep_hours, activity_minutes, created_at } = req.body;

    const entry = await HealthData.create({
      user_id: req.user.id,
      weight,
      sleep_hours,
      activity_minutes,
      created_at
    });

    return res.status(201).json(entry);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// Lister toutes les entrées santé de l'utilisateur
export async function listEntries(req, res) {
  try {
    const entries = await HealthData.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]]
    });
    return res.json(entries);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}
