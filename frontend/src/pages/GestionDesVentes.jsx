import React from 'react';
import { useNavigate } from 'react-router-dom';

const GestionDesVentes = () => {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-blue-200 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-center mb-8">GESTION DES VENTES</h1>
      <div className="grid grid-cols-2 gap-4 max-w-4xl w-full p-4">
        <button
          onClick={() => handleNavigation('/bon-livraison')}
          className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          BON DE LIVRAISON
        </button>
        <button
          onClick={() => handleNavigation('/facturation-bl')}
          className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          FACTURATION BL
        </button>
        <button
          onClick={() => handleNavigation('/facture-comptant')}
          className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          FACTURE COMPTANT
        </button>
        <button
          onClick={() => handleNavigation('/avoir-client')}
          className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          AVOIR CLIENT
        </button>
        <button
          onClick={() => handleNavigation('/consultant')}
          className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          CONSULTANT
        </button>
        <button
          onClick={() => handleNavigation('/Dashboard')}
          className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          DEVIS / FACT PROFORMA
        </button>
        <button
          onClick={() => handleNavigation('/journal-des-devis')}
          className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          JOURNAL DES DEVIS
        </button>
        <button
          onClick={() => handleNavigation('/editions')}
          className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          ÉDITIONS
        </button>
        <button
          onClick={() => handleNavigation('/facture-export')}
          className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          FACTURE EXPORT
        </button>
      </div>
    </div>
  );
};

export default GestionDesVentes;