import React, { useState, useEffect } from "react";
import { Edit, Eye, Trash2 } from "react-feather";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const DevisList = () => {
  const [devis, setDevis] = useState([]);
  const [filteredDevis, setFilteredDevis] = useState([]);
  const [filters, setFilters] = useState({
    NUMBL: "",
    libpv: "",
    CODECLI: "",
    ADRCLI: "",
    RSCLI: "",
    MTTC: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/devis/devis/details"
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des devis");
        }
        const data = await response.json();
        setDevis(data);
        setFilteredDevis(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDevis();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const applyFilters = () => {
      const filtered = devis.filter((devisItem) => {
        return (
          (!filters.NUMBL || devisItem.NUMBL?.includes(filters.NUMBL)) &&
          (!filters.libpv ||
            devisItem.client?.libpv?.includes(filters.libpv)) &&
          (!filters.CODECLI ||
            devisItem.client?.CODECLI?.includes(filters.CODECLI)) &&
          (!filters.ADRCLI ||
            devisItem.client?.ADRCLI?.includes(filters.ADRCLI)) &&
          (!filters.RSCLI ||
            devisItem.client?.RSCLI?.includes(filters.RSCLI)) &&
          (!filters.MTTC ||
            devisItem.client?.MTTC?.toString().includes(filters.MTTC))
        );
      });
      setFilteredDevis(filtered);
    };
    applyFilters();
  }, [filters, devis]);

  const handleView = (NUMBL) => {
    // Logique pour afficher le devis, ici nous redirigeons vers la page de détails du devis
    console.log(`Voir le devis ${NUMBL}`);
    navigate(`/devis-details/${NUMBL}`); // Redirection vers la page de détails
  };

  const handleDelete = (id) => {
    console.log(`Supprimer le devis ${id}`);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-bold text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
     

      <h1 className="text-black font-bold italic text-3xl text-center mb-6">
        Liste des Devis
      </h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {Object.keys(filters).map((key) => (
                <th key={key} className="px-6 py-2">
                  <input
                    type="text"
                    placeholder="Filtrer..."
                    value={filters[key]}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </th>
              ))}
            </tr>

            <tr className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white font-semibold text-lg shadow-md">
              <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                Numéro BL
              </th>
              <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                Point de vente
              </th>
              <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                Code client
              </th>
              <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                Adresse
              </th>
              <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                RSCLI
              </th>
              <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                Montant TTC
              </th>
              <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                Articles
              </th>
              <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredDevis.map((devisItem, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } border-b hover:bg-gray-100 transition-all duration-300`}
              >
                <td className="px-6 py-4 text-gray-700 border-b border-gray-300">
                  {devisItem.NUMBL || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-700 border-b border-gray-300">
                  {devisItem.client?.libpv || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-700 border-b border-gray-300">
                  {devisItem.client?.CODECLI || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-700 border-b border-gray-300">
                  {devisItem.client?.ADRCLI || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-700 border-b border-gray-300">
                  {devisItem.client?.RSCLI || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-700 border-b border-gray-300">
                  {devisItem.client?.MTTC || "N/A"} TND
                </td>
                <td className="px-6 py-4 text-gray-700 border-b border-gray-300">
                  <ul className="list-disc pl-5">
                    {devisItem.articles?.map((article, i) => (
                      <li key={i} className="text-sm text-gray-600">
                        {article.CodeART} - {article.DesART} ({article.QteART})
                      </li>
                    )) || "Aucun article"}
                  </ul>
                </td>

                <td className="px-6 py-4 text-gray-700 border-b border-gray-300 flex gap-2">
  {/* Bouton "Voir" */}
  <button
    onClick={() => handleView(devisItem.NUMBL)}
    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
    title="Voir"
  >
    <Eye size={16} />
  </button>

  {/* Bouton "Modifier" */}
  <Link to={`/Devis-Form/${devisItem.NUMBL}`}>
    <button
      className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
      title="Modifier"
    >
      <Edit size={16} />
    </button>
  </Link>

  {/* Bouton "Supprimer" */}
  <button
    onClick={() => handleDelete(devisItem.NUMBL)}
    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
    title="Supprimer"
  >
    <Trash2 size={16} />
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DevisList;
