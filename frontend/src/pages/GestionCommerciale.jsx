import React from 'react';
import { useNavigate } from 'react-router-dom';

const GestionCommerciale = () => {
  const sections = [
    'ACHAT', 'VENTE', 'CLIENT', 'FOURNIS', 'B.C.C.', 'STAT.',
    'IM. PHYSIQUE', 'GESTION DES A.D.', 'PRODUCTION', 'POINTS DE VENTE', 'CAISSE CENTRALE', 'SUIVI DES AFFAIRES'
  ];

  const navigate = useNavigate();

  const handleSectionClick = (section) => {
    if (section === 'VENTE') {
      navigate('/GestionDesVentes');
    }
   
  };

  return (
    <div className="bg-blue-500 h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-3xl mb-5">GESTION COMMERCIALE</h1>
      <div className="grid grid-cols-3 gap-5">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg shadow-lg text-center cursor-pointer"
            onClick={() => handleSectionClick(section)} 
          >
            {section}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionCommerciale;
