export default function HealthTable({ entries, onEdit, onDelete }) {
  return (
    <table className="table table-bordered table-hover">
      <thead className="table-success">
        <tr>
          <th>Date</th>
          <th>Poids (kg)</th>
          <th>Sommeil (h)</th>
          <th>Activité (min)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(e => (
          <tr key={e.id}>
            <td>{e.created_at}</td>
            <td>{e.weight}</td>
            <td>{e.sleep_hours}</td>
            <td>{e.activity_minutes}</td>
            <td>
              <button className="btn btn-outline-success btn-sm me-2" onClick={() => onEdit(e)}>
                <i className="bi bi-pencil-square"></i>
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(e.id)}>
                <i className="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
