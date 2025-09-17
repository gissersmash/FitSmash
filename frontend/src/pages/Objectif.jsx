import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
const goalService = require("../services/goalService");

export default function Objectif() {
  const [showSavedPage, setShowSavedPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [savedObjectifs, setSavedObjectifs] = useState([]);

  const defaultObjectifs = [
    { type: "Calories", objectif: "", pourcentage: "" },
    { type: "Glucides", objectif: "", pourcentage: "" },
    { type: "Lipides", objectif: "", pourcentage: "" },
    { type: "Protéines", objectif: "", pourcentage: "" }
  ];

  const [objectifs, setObjectifs] = useState(defaultObjectifs);
  const [validationMsg, setValidationMsg] = useState("");

  const totalPct = objectifs
    .slice(1)
    .reduce((sum, obj) => sum + (parseInt(obj.pourcentage, 10) || 0), 0);

  // Récupérer les objectifs existants
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:4000/api/goals", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const goals = Array.isArray(res.data) ? res.data : [];
        setSavedObjectifs(goals);
        if (goals.length >= 4) {
          setObjectifs(goals.slice(-4).map(g => ({
            type: g.type,
            objectif: g.value,
            pourcentage: ["Glucides","Lipides","Protéines"].includes(g.type) ? g.pourcentage : ""
          })));
        }
      })
      .catch((err) => console.error("Erreur récupération objectifs :", err.response?.data || err.message));
  }, []);

  // Gestion de l'input Calories
  const handleChangeCalories = (e) => {
    const kcal = parseInt(e.target.value, 10);
    const newArr = [...objectifs];
    newArr[0].objectif = e.target.value;

    if (!isNaN(kcal)) {
      const glucidesPct = 50;
      const lipidesPct = 30;
      const proteinesPct = 20;

      newArr[1].pourcentage = glucidesPct.toString();
      newArr[2].pourcentage = lipidesPct.toString();
      newArr[3].pourcentage = proteinesPct.toString();

      newArr[1].objectif = Math.round((kcal * glucidesPct) / 100 / 4) + " g";
      newArr[2].objectif = Math.round((kcal * lipidesPct) / 100 / 9) + " g";
      newArr[3].objectif = Math.round((kcal * proteinesPct) / 100 / 4) + " g";
    } else {
      newArr.slice(1).forEach(obj => {
        obj.objectif = "";
        obj.pourcentage = "";
      });
    }

    setObjectifs(newArr);
  };

  // Valider et envoyer au backend
  const handleValidate = async () => {
    setServerError("");
    setLoading(true);

    if (totalPct !== 100) {
      setValidationMsg("Le total des pourcentages doit être égal à 100%.");
      setLoading(false);
      return;
    }

    setValidationMsg("Objectifs validés !");
    try {
      const token = localStorage.getItem("token");
      if (token) require("../services/api").setToken(token);

      const res = await goalService.saveNutritionGoals({ goals: objectifs });
      const savedGoals = Array.isArray(res.data.goals) ? res.data.goals : [];
      setSavedObjectifs(savedGoals);
      setLoading(false);

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Erreur backend :", err.response?.data || err.message);
      setServerError("Erreur lors de l'enregistrement côté serveur.");
      setLoading(false);
    }
  };

  const handleClear = () => {
    setObjectifs(defaultObjectifs);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFBEA" }}>
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
                    {obj.type === "Calories" ? (
                      <input
                        type="number"
                        className="form-control"
                        value={obj.objectif}
                        placeholder="Objectif (ex: 1500)"
                        onChange={handleChangeCalories}
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        value={obj.objectif || ""}
                        disabled
                      />
                    )}
                  </td>
                  <td>
                    {obj.type === "Calories" ? (
                      <input type="text" className="form-control" value="-" disabled />
                    ) : (
                      <input type="text" className="form-control" value={obj.pourcentage || ""} disabled />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3">
            <strong>Total pourcentages macronutriments : {totalPct}%</strong>
            {totalPct !== 100 && <span className="text-danger ms-2">(Le total doit être 100%)</span>}
            <button className="btn btn-primary ms-3" onClick={handleValidate}>Valider mes objectifs</button>
            {validationMsg && <div className={`mt-2 alert ${totalPct === 100 ? "alert-success" : "alert-danger"}`}>{validationMsg}</div>}
            {loading && <div className="mt-2 text-info">Enregistrement en cours...</div>}
            {serverError && <div className="mt-2 alert alert-danger">{serverError}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
