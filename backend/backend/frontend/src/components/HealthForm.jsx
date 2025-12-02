import { useState } from "react";
import { addHealthEntry } from "../services/healthService";

export default function HealthForm({ refresh }) {
  const [weight, setWeight] = useState("");
  const [sleep, setSleep] = useState("");
  const [activity, setActivity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addHealthEntry({
        weight,
        sleep_hours: sleep,
        activity_minutes: activity,
        created_at: new Date().toISOString().split("T")[0]
      });
      setWeight(""); setSleep(""); setActivity("");
      refresh(); // pour recharger les données après ajout
    } catch (err) {
      alert("Erreur lors de l'ajout des données");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center mb-3">
        <span style={{ fontSize: 32, color: '#1ec287' }}>
          <i className="bi bi-clipboard-heart"></i>
        </span>
        <h5 style={{ color: '#1ec287', fontWeight: 'bold', marginTop: 10 }}>Ajouter une entrée santé</h5>
      </div>
      <div className="mb-3">
        <label className="form-label">Poids (kg)</label>
        <input
          type="number"
          className="form-control"
          placeholder="Poids (kg)"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          min="0"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Heures de sommeil</label>
        <input
          type="number"
          className="form-control"
          placeholder="Heures de sommeil"
          value={sleep}
          onChange={e => setSleep(e.target.value)}
          min="0"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Minutes d'activité</label>
        <input
          type="number"
          className="form-control"
          placeholder="Minutes d'activité"
          value={activity}
          onChange={e => setActivity(e.target.value)}
          min="0"
          required
        />
      </div>
      <button className="btn w-100" type="submit" style={{ backgroundColor: '#1ec287', border: 'none', fontWeight: 'bold' }}>
        <i className="bi bi-plus-circle me-2"></i>Ajouter
      </button>
    </form>
  );
}
