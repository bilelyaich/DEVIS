import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaTruck, FaChartBar, FaWarehouse, FaCashRegister } from 'react-icons/fa';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { BsBuilding, BsGraphUp } from 'react-icons/bs';
import { AiOutlineStock } from 'react-icons/ai';

const GestionCommerciale = () => {
 
  const sections = [
    { name: 'ACHAT', icon: <FaShoppingCart /> },
    { name: 'VENTE', icon: <FaCashRegister /> },
    { name: 'CLIENT', icon: <FaUser /> },
    { name: 'FOURNIS', icon: <FaTruck /> },
    { name: 'B.C.C.', icon: <AiOutlineStock /> },
    { name: 'STAT.', icon: <BsGraphUp /> },
    { name: 'IM. PHYSIQUE', icon: <FaWarehouse /> },
    { name: 'GESTION DES A.D.', icon: <BsBuilding /> },
    { name: 'PRODUCTION', icon: <MdOutlineProductionQuantityLimits /> },
    { name: 'POINTS DE VENTE', icon: <FaCashRegister /> },
    { name: 'CAISSE CENTRALE', icon: <FaCashRegister /> },
    { name: 'SUIVI DES AFFAIRES', icon: <FaChartBar /> },
  ];

  const navigate = useNavigate();

  const handleSectionClick = (section) => {
    if (section === 'VENTE') {
      navigate('/GestionDesVentes');
    }
  
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-900 min-h-screen flex flex-col items-center relative">
     
      <img
        src="/eee.PNG"
        alt="Illustration"
        className="absolute bottom-0 left-0 h-64 w-64 object-contain mb-4 ml-4" 
      />

      <h1 className="text-white text-4xl font-bold mt-10 mb-12">GESTION COMMERCIALE</h1>
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-11/12 max-w-7xl">
        {sections.map((section, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-lg transform transition hover:scale-105 hover:shadow-2xl cursor-pointer"
            onClick={() => handleSectionClick(section.name)}
          >
            <div className="text-blue-500 text-5xl mb-4">{section.icon}</div>
            <p className="text-gray-800 text-xl font-semibold">{section.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionCommerciale;
