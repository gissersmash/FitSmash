import React, { useEffect } from "react";
import Sidebar from '../components/Sidebar';
import axios from 'axios';

export default function Objectif() {
  React.useEffect(() => {
    console.log('Render Objectif', { objectifs, savedObjectifs, loading, serverError });
  });
  const [showSavedPage, setShowSavedPage] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState("");
  const goalService = require('../services/goalService');
  const [savedObjectifs, setSavedObjectifs] = React.useState([]);
  const defaultObjectifs = [
    { type: "Calories", objectif: "", pourcentage: "" },
    { type: "Glucides", objectif: "", pourcentage: "" },
    { type: "Lipides", objectif: "", pourcentage: "" },
    { type: "Protéines", objectif: "", pourcentage: "" }
  ];
  // Récupère les objectifs enregistrés à chaque affichage ou retour sur la page
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:4000/api/goals', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        let goals = Array.isArray(res.data) ? res.data : res.data.goals || res.data.data || [];
        setSavedObjectifs(goals);
        // Met à jour le state local des objectifs si besoin
        if (goals.length >= 4) {
          setObjectifs(goals.slice(-4));
        }
      });
    }
  }, []);
  const [objectifs, setObjectifs] = React.useState(defaultObjectifs);
  const [validationMsg, setValidationMsg] = React.useState("");
  const totalPct = objectifs.slice(1).reduce((sum, obj) => sum + (parseInt(obj.pourcentage, 10) || 0), 0);
  const handleValidate = async () => {
    console.log('Validation déclenchée', { objectifs });
    setServerError("");
    if (totalPct === 100) {
      setValidationMsg("Objectifs validés !");
      setSavedObjectifs([...objectifs]);
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (token) require('../services/api').setToken(token);
  await goalService.saveNutritionGoals({ goals: objectifs });
        setLoading(false);
  // Après modification, redirige vers le dashboard pour déclencher le refresh
  window.location.href = '/dashboard';
      } catch (err) {
        setServerError("Erreur lors de l'enregistrement côté serveur.");
        setLoading(false);
      }
    } else {
      setValidationMsg("Le total des pourcentages doit être égal à 100%.");
      setSavedObjectifs(null);
    }
  };

  const [newObj, setNewObj] = React.useState({ type: "", objectif: "", pourcentage: "" });

  const handleChange = e => {
    setNewObj({ ...newObj, [e.target.name]: e.target.value });
  };

  const handleAdd = e => {
    e.preventDefault();
    if (newObj.type && newObj.objectif) {
      setObjectifs([...objectifs, newObj]);
      setNewObj({ type: "", objectif: "", pourcentage: "" });
    }
  };

  const handleClear = () => setObjectifs(defaultObjectifs);

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBEA' }}>
      <Sidebar />
      <div className="container py-4" style={{ maxWidth: 900, marginTop: 40, marginLeft: 240 }}>
        <div className="card shadow p-3 mb-4">
          <h5 className="mb-3" style={{ color: "#1ec287" }}>Objectifs nutritionnels quotidiens</h5>
          <button className="btn btn-outline-danger mb-3" onClick={handleClear}>Vider le tableau</button>
          <table className="table table-bordered table-hover">
            <thead className="table-success">
              <tr>
                <th>Type</th>
                <th>Objectif</th>
                <th>Pourcentage</th>
              </tr>
            </thead>
            <tbody>
              {objectifs.map((obj, idx) => (
                <tr key={idx}>
                  <td>{obj.type}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={obj.objectif}
                      placeholder={obj.type === "Calories" ? "Objectif (ex: 1500)" : "Grammes"}
                      onChange={e => {
                        const newArr = [...objectifs];
                        if (obj.type === "Calories") {
                          newArr[idx].objectif = e.target.value;
                          // Calcul automatique des macronutriments
                          const kcal = parseInt(e.target.value, 10);
                          if (!isNaN(kcal)) {
                            // Pourcentages par défaut
                            const glucidesPct = 50;
                            const lipidesPct = 30;
                            const proteinesPct = 20;
                            newArr[1].pourcentage = glucidesPct.toString();
                            newArr[2].pourcentage = lipidesPct.toString();
                            newArr[3].pourcentage = proteinesPct.toString();
                            // Calculs
                            newArr[1].objectif = Math.round((kcal * glucidesPct / 100) / 4) + " g";
                            newArr[2].objectif = Math.round((kcal * lipidesPct / 100) / 9) + " g";
                            newArr[3].objectif = Math.round((kcal * proteinesPct / 100) / 4) + " g";
                          } else {
                            newArr[1].objectif = "";
                            newArr[2].objectif = "";
                            newArr[3].objectif = "";
                            newArr[1].pourcentage = "";
                            newArr[2].pourcentage = "";
                            newArr[3].pourcentage = "";
                          }
                          setObjectifs(newArr);
                        } else {
                          newArr[idx].objectif = e.target.value;
                          // Calcul automatique du pourcentage
                          const kcal = parseInt(newArr[0].objectif, 10);
                          let grammes = parseFloat(e.target.value);
                          if (!isNaN(kcal) && !isNaN(grammes)) {
                            let pct = 0;
                            if (obj.type === "Glucides") pct = Math.round((grammes * 4 / kcal) * 100);
                            if (obj.type === "Lipides") pct = Math.round((grammes * 9 / kcal) * 100);
                            if (obj.type === "Protéines") pct = Math.round((grammes * 4 / kcal) * 100);
                            newArr[idx].pourcentage = pct.toString();
                          } else {
                            newArr[idx].pourcentage = "";
                          }
                          setObjectifs(newArr);
                        }
                      }}
                    />
                  </td>
                  <td>
                    {obj.type === "Calories" ? (
                      <input
                        type="text"
                        className="form-control"
                        value={"-"}
                        disabled
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        value={obj.pourcentage}
                        placeholder="Pourcentage (ex: 50%)"
                        onChange={e => {
                          const newArr = [...objectifs];
                          newArr[idx].pourcentage = e.target.value;
                          // Recalcule les grammes si calories déjà renseignées
                          const kcal = parseInt(newArr[0].objectif, 10);
                          if (!isNaN(kcal)) {
                            if (obj.type === "Glucides") {
                              newArr[idx].objectif = Math.round((kcal * parseInt(e.target.value, 10) / 100) / 4) + " g";
                            }
                            if (obj.type === "Lipides") {
                              newArr[idx].objectif = Math.round((kcal * parseInt(e.target.value, 10) / 100) / 9) + " g";
                            }
                            if (obj.type === "Protéines") {
                              newArr[idx].objectif = Math.round((kcal * parseInt(e.target.value, 10) / 100) / 4) + " g";
                            }
                          }
                          setObjectifs(newArr);
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3">
            <strong>Total pourcentages macronutriments : {totalPct}%</strong>
            {totalPct !== 100 && (
              <span className="text-danger ms-2">(Le total doit être 100%)</span>
            )}
            <button className="btn btn-primary ms-3" onClick={handleValidate}>Valider mes objectifs</button>
            {validationMsg && (
              <div className={`mt-2 alert ${totalPct === 100 ? 'alert-success' : 'alert-danger'}`}>{validationMsg}</div>
            )}
            {loading && <div className="mt-2 text-info">Enregistrement en cours...</div>}
            {serverError && <div className="mt-2 alert alert-danger">{serverError}</div>}
            {savedObjectifs && savedObjectifs.length > 0 && !showSavedPage && (
              <div className="mt-4">
                <h6>Objectifs nutritionnels enregistrés :</h6>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Objectif</th>
                      <th>Pourcentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Regroupe par série de 4 (calories, glucides, lipides, protéines)
                      const filtered = savedObjectifs.filter(obj => ["Calories", "Glucides", "Lipides", "Protéines"].includes(obj.type));
                      const lastSet = filtered.slice(-4);
                      return lastSet.map((obj, idx) => (
                        <tr key={idx}>
                          <td>{obj.type}</td>
                          <td>{obj.value !== undefined ? obj.value : '-'}</td>
                          <td>{obj.pourcentage !== undefined ? obj.pourcentage + '%' : '-'}</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
                <button className="btn btn-outline-primary mt-2" onClick={() => setShowSavedPage(true)}>Voir la page de mes objectifs</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
