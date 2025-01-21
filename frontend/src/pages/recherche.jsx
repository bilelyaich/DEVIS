import React, { useState, useEffect } from 'react';

const Recherche = () => {
  const [selectedCriteria, setSelectedCriteria] = useState('client'); 
  const [searchValue, setSearchValue] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState(localStorage.getItem('selectedDatabase') );
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState('');
  const [results, setResults] = useState([]); 

  useEffect(() => {
    localStorage.setItem('selectedDatabase', selectedDatabase); 
  }, [selectedDatabase]);

  
  const handleCriteriaChange = (e) => {
    setSelectedCriteria(e.target.value);
  };

 
  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  
  const handleSearch = async () => {  
    console.log(`Recherche par: ${selectedCriteria}, Valeur: ${searchValue}`);

    if (!searchValue) {
      alert("Veuillez entrer une valeur pour la recherche.");
      return;
    }

    setLoading(true);
    setError(''); 
    try {
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/devis/search/client/${selectedDatabase}/${searchValue}`
      );
      
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data.results); 
    } catch (err) {
      console.error("Erreur de requête API:", err);
      setError('Une erreur est survenue lors de la récupération des résultats.'); 
    } finally {
      setLoading(false); 
    }
  };

  
  const handleCancel = () => {
    setSearchValue('');
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Recherche</h2>

      <div className="flex space-x-6">
        <div className="w-1/3 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Recherche par</h3>
          <div className="space-y-2">
            {['devis', 'client', 'montant', 'periode', 'article'].map((criteria) => (
              <label key={criteria} className="flex items-center">
                <input
                  type="radio"
                  value={criteria}
                  checked={selectedCriteria === criteria}
                  onChange={handleCriteriaChange}
                  className="mr-2"
                />
                {criteria.charAt(0).toUpperCase() + criteria.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="w-2/3 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            {selectedCriteria.charAt(0).toUpperCase() + selectedCriteria.slice(1)}:
          </h3>
          <div className="flex items-center space-x-2">
            <input
              id="searchInput"
              type="text"
              value={searchValue}
              onChange={handleSearchInputChange}
              placeholder={`Entrez le ${selectedCriteria}`}
              className="p-2 border border-gray-300 rounded-lg w-full"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Rechercher
            </button>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={handleSearch}
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Valider
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition duration-200"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

     
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {results && results.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold">Résultats :</h4>
          <ul>
            {results.map((result, index) => (
               <li key={index} className="mb-2">
               <p><strong>Numéro de devis:</strong> {result.NUMBL}</p>
               <p><strong>Client:</strong> {result.RSCLI}</p>
               <p><strong>Adresse:</strong> {result.ADRCLI}</p>
               <p><strong>Code client:</strong> {result.CODECLI}</p>
               <p><strong>Montant TTC:</strong> {result.MTTC}</p>
               <p><strong>Article:</strong> {result.CODEART ? result.CODEART : 'Non spécifié'}</p>
               {result.DESART && (
                 <p><strong>Description:</strong> {result.DESART}</p>
               )}
               {result.QTEART && (
                 <p><strong>Quantité:</strong> {result.QTEART}</p>
               )}
               {result.REMISE !== null && (
                 <p><strong>Remise:</strong> {result.REMISE} %</p>
               )}
               {result.TAUXTVA && (
                 <p><strong>TVA:</strong> {result.TAUXTVA} %</p>
               )}
             </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Recherche;
