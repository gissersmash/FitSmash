import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import * as goalService from "../services/goalService";

export default function Objectif() {
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
    goalService.getNutritionGoals()
      .then(goals => {
        setSavedObjectifs(goals);
        if (goals.length >= 4) {
          setObjectifs(goals.slice(-4).map(g => ({
            type: g.type,
            objectif: g.value,
            pourcentage: ["Glucides","Lipides","Protéines"].includes(g.type) ? g.pourcentage : ""
          })));
        }
      })
      .catch(err => console.error("Erreur récupération objectifs :", err));
  }, []);

  // Gestion input Calories
  const handleChangeCalories = (e) => {
    const kcal = parseInt(e.target.value, 10);
    const newArr = [...objectifs];
    newArr[0].objectif = e.target.value;

    if (!isNaN(kcal)) {
      const glucidesPct = 50, lipidesPct = 30, proteinesPct = 20;
      newArr[1].pourcentage = glucidesPct.toString();
      newArr[2].pourcentage = lipidesPct.toString();
      newArr[3].pourcentage = proteinesPct.toString();

      newArr[1].objectif = Math.round((kcal * glucidesPct) / 100 / 4) + " g";
      newArr[2].objectif = Math.round((kcal * lipidesPct) / 100 / 9) + " g";
      newArr[3].objectif = Math.round((kcal * proteinesPct) / 100 / 4) + " g";
    } else {
      newArr.slice(1).forEach(obj => { obj.objectif = ""; obj.pourcentage = ""; });
    }
    setObjectifs(newArr);
  };

  // Validation
  const handleValidate = async () => {
    setServerError("");
    setLoading(true);

    if (totalPct !== 100) {
      setValidationMsg("Le total des pourcentages doit être égal à 100%.");
      setLoading(false);
      return;
    }

    try {
      const savedGoals = await goalService.saveNutritionGoals({ goals: objectifs });
      setSavedObjectifs(savedGoals);

      // Sauvegarde locale
      localStorage.setItem("goals", JSON.stringify(savedGoals));

      setValidationMsg("Objectifs validés !");
      setLoading(false);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Erreur backend :", err);
      setServerError("Erreur lors de l'enregistrement côté serveur.");
      setLoading(false);
    }
  };

  const handleClear = () => setObjectifs(defaultObjectifs);

  return (
    <div style={{ minHeight: "100vh", background: "#FFFBEA" }}>
      <Sidebar />
      <div className="container py-4 d-flex justify-content-center" style={{ maxWidth: 900, marginTop: 40 }}>
        <div className="card shadow-lg p-4 mb-5 w-100">
          <h3 className="mb-4 text-center" style={{ color: '#1ec287' }}>
            <i className="bi bi-bullseye" style={{ marginRight: 10 }}></i>
            Objectifs nutritionnels quotidiens
          </h3>
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
                      <input type="number" className="form-control" value={obj.objectif}
                             placeholder="Objectif (ex: 1500)" onChange={handleChangeCalories}/>
                    ) : (
                      <input type="text" className="form-control" value={obj.objectif || ""} disabled />
                    )}
                  </td>
                  <td>
                    {obj.type === "Calories" ? (
                      <input type="text" className="form-control" value="-" disabled />
                    ) : (
                      <input type="text" className="form-control" value={obj.pourcentage + "%"} disabled />
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
