import React, { useState, useEffect } from "react";
import { addFood } from "../services/foodService";
import Navbar from "../components/Navbar"; // 👈 1. Importer la Navbar
import Sidebar from "../components/Sidebar";
import { searchFoodsByName } from "../services/nutritionService";

export default function FoodGallery() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async (currentPage, query) => {
    setLoading(true);
    try {
      // On utilise la fonction de recherche, même avec une requête vide pour "tout" parcourir
      const results = await searchFoodsByName(query, currentPage);
      setProducts(results);
    } catch (err) {
      console.error("Erreur lors de la récupération des produits:", err);
      setProducts([]); // Vider en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  // Charger les produits au montage et quand la page change
  useEffect(() => {
    fetchProducts(page, searchTerm);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Revenir à la première page pour une nouvelle recherche
    fetchProducts(1, searchTerm);
  };

  const handleAddFood = async (product) => {
    try {
      // Préparer les données pour votre backend
      const foodData = {
        name: product.name,
        calories: product.calories,
        // Assurez-vous que les autres champs correspondent à votre modèle de données backend
        // Par exemple : proteines, glucides, lipides, etc.
      };
      await addFood(foodData);
      alert(`${product.name} a été ajouté à votre suivi !`);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'aliment :", error);
      alert("Erreur lors de l'ajout de l'aliment.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFBEA" }}>
      <Sidebar />
      <Navbar /> {/* 👈 2. Ajouter la Navbar ici */}
      <div className="container" style={{ marginLeft: 240, paddingTop: 40 }}>
        <div className="card shadow p-4 mb-4">
          <h3 className="mb-4" style={{ color: "#1ec287" }}>
            <i className="bi bi-images me-2"></i>Galerie d'aliments
          </h3>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="input-group mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher un aliment (ou laisser vide pour tout voir)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Rechercher
            </button>
          </form>

          {/* Galerie d'images */}
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {products.map((p, index) => (
                <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
                  <div className="card h-100 text-center">
                    <img
                      src={p.image || "/placeholder.png"} // Image par défaut si aucune n'est trouvée
                      className="card-img-top"
                      alt={p.name}
                      style={{ height: 150, objectFit: "contain", padding: 10 }}
                      onError={(e) => { e.target.onerror = null; e.target.src="/placeholder.png"; }} // Fallback si l'image ne charge pas
                    />
                    <div className="card-body">
                      <p className="card-text" style={{ fontSize: '0.9rem' }}>{p.name}</p>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleAddFood(p)}
                      >
                        <i className="bi bi-plus-circle"></i> Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(page - 1)}>
                  Précédent
                </button>
              </li>
              <li className="page-item active">
                <span className="page-link">Page {page}</span>
              </li>
              <li className="page-item">
                <button className="page-link" onClick={() => setPage(page + 1)}>
                  Suivant
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
