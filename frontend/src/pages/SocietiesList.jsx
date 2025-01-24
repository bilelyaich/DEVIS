import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SocietiesList = () => {
  const [societies, setSocieties] = useState([]);
  const navigate = useNavigate();

  // Dictionnaire des icônes par société
  const societyIcons = {
    "Society A": "🏢",
    "Society B": "💼",
    "Society C": "🛠️",
    // Ajoutez d'autres sociétés et icônes ici
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const societiesFromStorage = JSON.parse(localStorage.getItem("societies"));
    if (societiesFromStorage) {
      setSocieties(societiesFromStorage);
    } else {
      console.log("Aucune société trouvée dans le localStorage.");
    }
  }, [navigate]);

  const handleSelect = async (society) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // Sélectionner la base de données
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/select-database`,
        { databaseName: society },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const devisList = response.data.devis;
        console.log("Liste des devis récupérés :", devisList);

        const selectedNumbl = devisList.map((devis) => devis.numbl);
        console.log("Tous les numbl récupérés :", selectedNumbl);

        localStorage.setItem("selectedDatabase", society);
        localStorage.setItem("selectedNumbl", JSON.stringify(selectedNumbl));

        navigate("/GestionCommerciale");
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de la base de données:", error);
      alert("Une erreur est survenue lors de la sélection de la société.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-indigo-600 to-purple-700 flex items-start justify-center p-8">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Liste des Sociétés
        </h1>

        {societies.length === 0 ? (
          <div className="text-center text-gray-600">
            Aucune société trouvée.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {societies.map((society, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center text-lg font-semibold text-gray-800 mb-2">
                  {/* Affichez l'icône si elle existe pour la société */}
                  <span className="mr-2 text-2xl">
                    {societyIcons[society] || "🏢"}
                  </span>
                  {society}
                </div>
                <button
                  onClick={() => handleSelect(society)}
                  className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Sélectionner
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocietiesList;
