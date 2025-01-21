import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DevisDetails = () => {
  const { numbl } = useParams();
  const [devis, setDevis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevisDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/devis/devis/${numbl}`);

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des détails du devis");
        }
        const data = await response.json();
        console.log("Données reçues:", data); 
        
       
        const devisData = data[0]; 
        setDevis(devisData); 
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDevisDetails();
  }, [numbl]);

  if (error) {
    return <div className="text-red-600 font-semibold">{error}</div>;
  }

  if (!devis) {
    return <div className="text-center text-lg">Chargement...</div>;
  }

 
  const client = devis.client || {};
  const articles = devis.articles || [];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Détails du devis {numbl}</h1>
      <div className="space-y-6">
        {client.ADRCLI ? (
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-gray-700">Informations client</h2>
            <p className="text-gray-600"><strong>Adresse :</strong> {client.ADRCLI}</p>
            <p className="text-gray-600"><strong>Code client :</strong> {client.CODECLI}</p>
            <p className="text-gray-600"><strong>RSCLI :</strong> {client.RSCLI}</p>
            <p className="text-gray-600"><strong>Montant total (MTTC) :</strong> {client.MTTC} TND</p>
          </div>
        ) : (
          <p className="text-red-500">Informations client non disponibles</p>
        )}

        <div>
          <h2 className="text-xl font-semibold text-gray-700">Articles</h2>
          {articles.length > 0 ? (
            <ul className="space-y-4">
              {articles.map((article, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow-sm">
                  <div>
                    <p className="font-semibold text-gray-800">{article.CodeART} - {article.DesART}</p>
                    <p className="text-gray-600">Quantité : {article.QteART}</p>
                  </div>
                  <p className="text-gray-600">Remise : {article.Remise}%</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Aucun article trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevisDetails;
