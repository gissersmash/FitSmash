import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TableauSuivi from "./pages/TableauSuivi.jsx";
import GraphiqueSante from "./pages/GraphiqueSante.jsx";
import Objectif from "./pages/Objectif.jsx";
import MesObjectifs from "./pages/MesObjectifs.jsx";
import SuiviNutrition from "./pages/SuiviNutrition.jsx";

function App() {
  // Récupère l'utilisateur depuis le localStorage (après login)
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tableau-suivi" element={<TableauSuivi />} />
          <Route path="/graphique-sante" element={<GraphiqueSante />} />
          <Route path="/objectif" element={<Objectif />} />
          <Route path="/mes-objectifs" element={<MesObjectifs />} />
          <Route path="/suivi-nutrition" element={<SuiviNutrition />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
