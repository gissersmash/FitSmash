import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDarkMode } from "./hooks/useDarkMode";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TableauSuivi from "./pages/TableauSuivi.jsx";
import GraphiqueSante from "./pages/GraphiqueSante.jsx";
import Objectif from "./pages/Objectif.jsx";
import MesObjectifs from "./pages/MesObjectifs.jsx";
import Abonnement from "./pages/Abonnement.jsx";
import Contact from "./pages/Contact.jsx";
import Parametres from "./pages/Parametres.jsx";

function App() {
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const isAuthenticated = !!localStorage.getItem('token');
  
  // Apply dark mode globally on app load
  useDarkMode();
  
  return (
    <MantineProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tableau-suivi" element={<TableauSuivi />} />
          <Route path="/graphique-sante" element={<GraphiqueSante />} />
          <Route path="/objectif" element={<Objectif />} />
          <Route path="/mes-objectifs" element={<MesObjectifs />} />
          <Route path="/abonnement" element={<Abonnement />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/parametres" element={<Parametres />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
