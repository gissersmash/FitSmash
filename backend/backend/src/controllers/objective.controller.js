// backend/src/controllers/objective.controller.js
import { Objective } from "../models/Objective.js";

export async function createObjective(req, res) {
  try {
    const userId = req.user.id;
    const { title, target_value, unit, deadline } = req.body;
    if (!title || target_value == null) return res.status(400).json({ message: "Titre et valeur cible requis" });

    const obj = await Objective.create({
      user_id: userId,
      title,
      target_value,
      unit: unit ?? "",
      current_value: 0,
      deadline: deadline || null
    });
    return res.status(201).json(obj);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

export async function listObjectives(req, res) {
  try {
    const userId = req.user.id;
    const objs = await Objective.findAll({ where: { user_id: userId }, order: [["created_at", "DESC"]] });
    return res.json(objs);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

export async function updateObjective(req, res) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const payload = req.body;
    const obj = await Objective.findOne({ where: { id, user_id: userId } });
    if (!obj) return res.status(404).json({ message: "Objectif introuvable" });

    await obj.update(payload);
    return res.json(obj);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

export async function deleteObjective(req, res) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const obj = await Objective.findOne({ where: { id, user_id: userId } });
    if (!obj) return res.status(404).json({ message: "Objectif introuvable" });

    await obj.destroy();
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}
