import React from "react";

export default function HealthTable({ entries, onDelete }) {
  if (!entries || entries.length === 0) return <p>Aucune entrée pour le moment.</p>;

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Date</th>
          <th>Poids (kg)</th>
          <th>Sommeil (h)</th>
          <th>Activité (min)</th>
          <th>Type d'activité</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(entry => (
          <tr key={entry.id}>
            <td>{new Date(entry.date).toLocaleDateString()}</td>
            <td>{entry.weight}</td>
            <td>{entry.sleep}</td>
            <td>{entry.activity}</td>
            <td>{entry.activity_type || '-'}</td>
            <td>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(entry.id)}
              >
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
