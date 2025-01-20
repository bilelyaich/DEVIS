import React from 'react';
import './App.css';
import DevisForm from './components/DevisForm';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import DevisList from './pages/DevisList';
import DevisDetails from './components/DevisDetails';
import Dashboard from './pages/Dashboard';

import SocietiesList from './pages/SocietiesList';
import Recherche from './pages/recherche';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GestionCommerciale from './pages/GestionCommerciale';
import GestionDesVentes from './pages/GestionDesVentes';

function App() {
  
  const notify = () => {
    toast.success("Bienvenue sur la page d'accueil !", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  return (
    <Router>
       <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar 
        closeOnClick 
        pauseOnHover 
      />

      <Routes>
        <Route path="/" element={<Navigate to="/Home-Page" />} /> 
        <Route path="/Devis-Form" element={<DevisForm />} />
        <Route path="/Home-Page" element={<HomePage />} />
        <Route path="/DevisList" element={<DevisList />} />
        <Route path="/SignInPage" element={<SignInPage />} />
        <Route path="/devis-details/:numbl" element={<DevisDetails />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/SocietiesList" element={<SocietiesList />} />
        <Route path="/recherche" element={<Recherche />} /> 
        <Route path="/GestionCommerciale" element={<GestionCommerciale />} /> 
        <Route path="/GestionDesVentes" element={<GestionDesVentes />} /> 
      </Routes>
    </Router>
  );
}    

export default App;
