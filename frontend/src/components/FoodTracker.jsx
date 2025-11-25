import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getFoods, deleteFood, searchFoods } from "../services/foodService";
import { setToken } from "../services/api";
import axios from "axios";

export default function FoodTracker() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fonction pour récupérer les aliments
  const fetchFoods = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/foods", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Réponse backend aliments :", res.data);

      setFoods(
        Array.isArray(res.data)
          ? res.data
          : res.data.foods || res.data.data || []
      );
    } catch (err) {
      console.error(
        "Erreur récupération aliments :",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Charger les aliments au montage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Pas de token trouvé → redirection login");
      window.location.href = "/login";
      return;
    }

    setToken(token);
    fetchFoods();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteFood(id);
      setFoods(foods.filter((f) => f.id !== id));
    } catch (err) {
      console.error(
        "Erreur suppression aliment :",
        err.response?.data || err.message
      );
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await searchFoods(searchTerm);
      console.log("Réponse API recherche:", res.data);
      setFoods(
        Array.isArray(res.data)
          ? res.data
          : res.data.foods || res.data.data || []
      );
    } catch (err) {
      console.error(
        "Erreur recherche aliments :",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFBEA" }}>
      <Sidebar />
      <div
        className="container d-flex justify-content-center"
        style={{
          maxWidth: 900,
          marginTop: 40,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div className="card shadow p-3 mb-4 w-100" style={{ maxWidth: 900 }}>
          <h5 className="mb-3" style={{ color: "#1ec287" }}>
            Suivi Nutrition
          </h5>

          {/* Champ de recherche d'aliment */}
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="text"
              placeholder="Rechercher un aliment par nom"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <button type="submit" className="btn btn-primary">
              Rechercher
            </button>
          </form>

          {/* Tableau aliments */}
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <table className="table table-bordered">
              <thead className="table-success">
                <tr>
                  {foods.length > 0 &&
                    Object.keys(foods[0]).map((key) =>
                      key !== "id" && key !== "image" ? (
                        <th key={key}>{key}</th>
                      ) : null
                    )}
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food.id}>
                    {Object.keys(food).map((key) =>
                      key !== "id" && key !== "image" ? (
                        <td key={key}>{food[key]}</td>
                      ) : null
                    )}
                    <td>
                      {food.image ? (
                        <img
                          src={food.image}
                          alt="aliment"
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(food.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
