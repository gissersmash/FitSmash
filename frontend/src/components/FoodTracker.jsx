// FoodTracker.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { saveFoodEntries, getFoodEntries } from "../services/foodEntryService";

export default function FoodTracker() {
  // États généraux
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [foodEntries, setFoodEntries] = useState([]);
  const [foods, setFoods] = useState([]);
  const itemsPerPage = 12;

  // États pour la gestion des repas
  const repasTypes = [
    { key: 'petitDejeuner', label: 'Petit déjeuner' },
    { key: 'dejeuner', label: 'Déjeuner' },
    { key: 'diner', label: 'Dîner' },
    { key: 'snacks', label: 'Snacks' }
  ];
  const [repasEntries, setRepasEntries] = useState({
    petitDejeuner: [],
    dejeuner: [],
    diner: [],
    snacks: []
  });
  const [rechercheRepas, setRechercheRepas] = useState({
    petitDejeuner: { query: '', results: [], loading: false, page: 1 },
    dejeuner: { query: '', results: [], loading: false, page: 1 },
    diner: { query: '', results: [], loading: false, page: 1 },
    snacks: { query: '', results: [], loading: false, page: 1 }
  });

  // Modale ajout aliment au repas
  const [selectedFoodRepas, setSelectedFoodRepas] = useState(null);
  const [selectedRepasKey, setSelectedRepasKey] = useState(null);
  const [quantityRepas, setQuantityRepas] = useState(100);

  // Recherche API OpenFoodFacts par repas
  const handleSearchRepas = async (repasKey) => {
    const query = rechercheRepas[repasKey].query;
    if (!query) return;
    setRechercheRepas(prev => ({
      ...prev,
      [repasKey]: { ...prev[repasKey], loading: true }
    }));
    try {
      const res = await axios.get(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1`
      );
      const products = res.data.products.map(p => {
        const nutr = p.nutriments || {};
        let kcal = nutr["energy-kcal_100g"] ?? nutr["energy-kcal_serving"] ?? nutr["energy_kcal"] ?? nutr["energy_100g"] ?? nutr["energy_serving"];
        if (typeof kcal === 'undefined' || kcal === null || isNaN(kcal)) kcal = "Non renseigné";
        return {
          name: p.product_name || p.generic_name || "Nom inconnu",
          calories: kcal,
          quantity: 100,
          image: p.image_front_small_url || p.image_url || null
        };
      });
      setRechercheRepas(prev => ({
        ...prev,
        [repasKey]: { ...prev[repasKey], results: products, loading: false, page: 1 }
      }));
    } catch (err) {
      setRechercheRepas(prev => ({
        ...prev,
        [repasKey]: { ...prev[repasKey], results: [], loading: false }
      }));
      console.error("Erreur recherche aliments :", err);
    }
  };

  // Ajout aliment au repas (ouvre la modale)
  const handleAddFoodToRepas = (food, repasKey) => {
    setSelectedFoodRepas(food);
    setSelectedRepasKey(repasKey);
    setQuantityRepas(100);
    // On vide les résultats de recherche pour ce repas
    setRechercheRepas(prev => ({
      ...prev,
      [repasKey]: { ...prev[repasKey], results: [] }
    }));
  };

  // Confirme l'ajout avec la quantité choisie
  const handleConfirmAddToRepas = () => {
    if (!selectedFoodRepas || !selectedRepasKey) return;
    let kcalPer100g = Number(selectedFoodRepas.calories);
    if (isNaN(kcalPer100g)) kcalPer100g = 0;
    const kcalTotal = Math.round((kcalPer100g * quantityRepas) / 100);
    const foodToAdd = {
      ...selectedFoodRepas,
      calories: kcalTotal,
      quantity: quantityRepas
    };
    setRepasEntries(prev => ({
      ...prev,
      [selectedRepasKey]: [...prev[selectedRepasKey], foodToAdd]
    }));
    setSelectedFoodRepas(null);
    setSelectedRepasKey(null);
    setQuantityRepas(100);
  };

  // Suppression aliment d'un repas
  const handleDeleteFoodRepas = (repasKey, idx) => {
    setRepasEntries(prev => ({
      ...prev,
      [repasKey]: prev[repasKey].filter((_, i) => i !== idx)
    }));
  };

  // Fonction globale pour recharger les aliments du backend
  const fetchEntries = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        require('../services/api').setToken(token);
      } catch (e) {}
    }
    const res = await getFoodEntries();
    let entries = [];
    if (Array.isArray(res.data)) entries = res.data;
    else if (Array.isArray(res.data.entries)) entries = res.data.entries;
    else if (Array.isArray(res.data.data)) entries = res.data.data;
    setFoodEntries(entries);
  };

  // Récupère les aliments de la table foods
  useEffect(() => {
    const fetchFoods = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.get('http://localhost:4000/api/foods', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFoods(response.data);
      } catch (err) {
        setFoods([]);
      }
    };
    fetchFoods();
  }, []);

  useEffect(() => {
    fetchEntries();
  }, []);

  // Rendu principal
  return (
    <div className="container py-3">
      <h4 className="mb-4">Suivi nutrition par repas</h4>
      <h5 className="mb-3">Aliments enregistrés (doughnut chart)</h5>
      <table className="table table-striped table-bordered mb-4">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Calories</th>
            <th>Quantité (g)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {foodEntries.map((f, i) => (
            <tr key={i}>
              <td>{f.name || f.foodName}</td>
              <td>{f.calories}</td>
              <td>{f.quantity}</td>
              <td>
                <button className="btn btn-outline-danger btn-sm" onClick={async () => {
                  // Suppression locale uniquement
                  setFoodEntries(foodEntries.filter((_, idx) => idx !== i));
                  setAlert({ show: true, message: "Aliment supprimé localement !", type: "success" });
                  await fetchEntries();
                }}>
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="row">
        {repasTypes.map(r => (
          <div className="col-md-6 mb-4" key={r.key}>
            <div className="card shadow">
              <div className="card-header bg-success text-white" style={{ fontWeight: 'bold' }}>{r.label}</div>
              <div className="card-body">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex : pomme, riz, poulet"
                    value={rechercheRepas[r.key].query}
                    onChange={e => setRechercheRepas(prev => ({
                      ...prev,
                      [r.key]: { ...prev[r.key], query: e.target.value }
                    }))}
                  />
                  <button className="btn btn-primary" onClick={() => handleSearchRepas(r.key)}>
                    Rechercher
                  </button>
                </div>
                {rechercheRepas[r.key].loading && <p>Chargement...</p>}
                {rechercheRepas[r.key].results.length > 0 && (
                  <div className="mb-3">
                    <h6>Résultats :</h6>
                    <div className="row g-3">
                      {rechercheRepas[r.key].results.slice((rechercheRepas[r.key].page-1)*itemsPerPage, rechercheRepas[r.key].page*itemsPerPage).map((res, i) => (
                        <div className="col-md-4 col-sm-6" key={i+(rechercheRepas[r.key].page-1)*itemsPerPage}>
                          <div className="card h-100 shadow-sm">
                            {res.image && (
                              <img src={res.image} alt={res.name} className="card-img-top" style={{ maxHeight: 140, objectFit: 'contain', background: '#f8f9fa' }} />
                            )}
                            <div className="card-body d-flex flex-column justify-content-between">
                              <h6 className="card-title mb-2" style={{ fontWeight: 'bold' }}>{res.name}</h6>
                              <p className="card-text mb-2">{res.calories} kcal pour 100g</p>
                              <button className="btn btn-success w-100 mt-auto" onClick={() => handleAddFoodToRepas(res, r.key)}>
                                <i className="bi bi-plus-circle me-2"></i>Ajouter au repas
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Pagination Bootstrap */}
                    <nav className="mt-3">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item${rechercheRepas[r.key].page === 1 ? ' disabled' : ''}`}>
                          <button className="page-link" onClick={() => setRechercheRepas(prev => ({
                            ...prev,
                            [r.key]: { ...prev[r.key], page: prev[r.key].page-1 }
                          }))}>&laquo;</button>
                        </li>
                        {Array.from({length: Math.ceil(rechercheRepas[r.key].results.length/itemsPerPage)}, (_, i) => (
                          <li key={i} className={`page-item${rechercheRepas[r.key].page === i+1 ? ' active' : ''}`}>
                            <button className="page-link" onClick={() => setRechercheRepas(prev => ({
                              ...prev,
                              [r.key]: { ...prev[r.key], page: i+1 }
                            }))}>{i+1}</button>
                          </li>
                        ))}
                        <li className={`page-item${rechercheRepas[r.key].page === Math.ceil(rechercheRepas[r.key].results.length/itemsPerPage) ? ' disabled' : ''}`}>
                          <button className="page-link" onClick={() => setRechercheRepas(prev => ({
                            ...prev,
                            [r.key]: { ...prev[r.key], page: prev[r.key].page+1 }
                          }))}>&raquo;</button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
                {/* Liste des aliments du repas */}
                <ul className="list-group mb-2">
                  {repasEntries[r.key].map((f, i) => (
                    <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{f.name} - {f.calories} kcal ({f.quantity}g)</span>
                      <span>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteFoodRepas(r.key, i)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
                {/* Bouton valider et enregistrer */}
                {repasEntries[r.key].length > 0 && (
                  <button className="btn btn-success w-100 mt-2" onClick={async () => {
                    await saveFoodEntries({ entries: repasEntries[r.key] });
                    await fetchEntries();
                    setRepasEntries(prev => ({
                      ...prev,
                      [r.key]: []
                    }));
                    setAlert({ show: true, message: `Aliments du ${r.label} enregistrés !`, type: "success" });
                  }}>
                    Valider et enregistrer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modale ajout aliment au repas */}
      {selectedFoodRepas && selectedRepasKey && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ajouter {selectedFoodRepas.name} au {repasTypes.find(r => r.key === selectedRepasKey)?.label}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => {setSelectedFoodRepas(null); setSelectedRepasKey(null);}}></button>
              </div>
              <div className="modal-body">
                {selectedFoodRepas.image && (
                  <div className="text-center mb-3">
                    <img src={selectedFoodRepas.image} alt={selectedFoodRepas.name} style={{ maxWidth: 120, maxHeight: 120, objectFit: 'contain' }} />
                  </div>
                )}
                <label className="form-label">Quantité (grammes)</label>
                <input type="number" className="form-control mb-3" value={quantityRepas} min={1} onChange={e => setQuantityRepas(Number(e.target.value))} />
                <p>Kcal pour {quantityRepas}g : <strong>{(() => {
                  let kcalPer100g = Number(selectedFoodRepas.calories);
                  if (isNaN(kcalPer100g)) return "Non renseigné";
                  return Math.round((kcalPer100g * quantityRepas) / 100);
                })()}</strong></p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-success w-100" onClick={handleConfirmAddToRepas}>Ajouter</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <h5 className="mb-3">Mes aliments (table foods)</h5>
      <ul className="list-group mb-4">
        {foods.map(food => (
          <li key={food.id || food._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{food.name} - {food.calories} kcal</span>
            <button className="btn btn-outline-danger btn-sm" onClick={async () => {
              const token = localStorage.getItem('token');
              await axios.delete(`http://localhost:4000/api/foods/${food.id || food._id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setFoods(foods.filter(f => (f.id || f._id) !== (food.id || food._id)));
            }}>
              <i className="bi bi-trash"></i>
            </button>
          </li>
        ))}
      </ul>
  {/* Debug API supprimé */}
    </div>
  );
}
