import React from 'react';
import './App.css';
import DevisForm from './components/DevisForm';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import DevisList from './pages/DevisList';
import DevisDetails from './components/DevisDetails';
import Dashboard from './pages/Dashboard';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Home-Page" />} /> 
        <Route path="/Devis-Form" element={<DevisForm />} />
        <Route path="/Home-Page" element={<HomePage />} />
        <Route path="/DevisList" element={<DevisList />} />
        <Route path="/SignInPage" element={<SignInPage />} />
        <Route path="/devis-details/:numbl" element={<DevisDetails />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        

      </Routes>
    </Router>
  );
}    

export default App;
