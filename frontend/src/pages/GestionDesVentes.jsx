import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaTruck, FaFileInvoice, FaDollarSign, FaUsers, 
  FaClipboardList, FaFileExport, FaEdit, FaChartBar, 
  FaClipboardCheck, FaPowerOff 
} from 'react-icons/fa';

const GestionDesVentes = () => {
  const navigate = useNavigate();

  const sectionsCentral = [
    { name: 'BON DE LIVRAISON', route: '/bon-livraison', icon: <FaTruck /> },
    { name: 'FACTURATION BL', route: '/facturation-bl', icon: <FaFileInvoice /> },
    { name: 'FACTURE COMPTANT', route: '/facture-comptant', icon: <FaDollarSign /> },
    { name: 'AVOIR CLIENT', route: '/avoir-client', icon: <FaUsers /> },
    { name: 'CONSULTATION FACTURE', route: '/consultation-facture', icon: <FaClipboardList /> },
    { name: 'DEVIS / FACT PROFORMA', route: '/Dashboard', icon: <FaClipboardCheck /> },
    { name: 'JOURNAL DES DEVIS', route: '/journal-des-devis', icon: <FaChartBar /> },
    { name: 'ÉDITIONS', route: '/editions', icon: <FaEdit /> },
    { name: 'FACTURE EXPORT', route: '/facture-export', icon: <FaFileExport /> },
  ];

  const modulesRight = [
    { name: 'Gestion Des ACHATS', route: '/achats' },
    { name: 'Gestion Des CLIENTS', route: '/clients' },
    { name: 'Gestion Des FOURNISSEURS', route: '/fournisseurs' },
    { name: 'Gestion Des B.C.C.', route: '/bcc' },
    { name: 'Gestion Des B.C.F.', route: '/bcf' },
  ];

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 text-white flex flex-col items-center relative">
      {/* Titre et bouton d'alimentation */}
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-4xl font-extrabold mb-6 border-b-4 border-gray-300 pb-2">
          GESTION DES VENTES
        </h1>
        <button className="bg-gray-100 p-4 rounded-full shadow-md hover:shadow-xl transition">
          <FaPowerOff className="text-red-600 text-3xl" />
        </button>
      </div>

      {/* Sections principales (centrales) */}
      <div className="grid grid-cols-2 gap-8 mt-12">
        {sectionsCentral.map((section, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(section.route)}
            className="flex flex-col items-center justify-center bg-white text-blue-700 w-64 h-24 rounded-lg shadow-md hover:shadow-xl hover:bg-gray-100 transition"
          >
            <div className="text-3xl mb-2">{section.icon}</div>
            <span className="text-lg font-semibold">{section.name}</span>
          </button>
        ))}
      </div>

      {/* Modules sur la droite */}
      <div className="absolute right-10 top-32 space-y-6">
        {modulesRight.map((module, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(module.route)}
            className="bg-gray-100 w-48 h-20 rounded-lg shadow-md hover:shadow-xl flex flex-col justify-center items-center text-blue-800 font-bold hover:bg-blue-200 transition"
          >
            <span>{module.name}</span>
            <span className="text-xs text-gray-500">IC ERP</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GestionDesVentes;
