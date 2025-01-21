import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [devisData, setDevisData] = useState([]); 
  const [totalDevis, setTotalDevis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevisData = async () => {
      try {
        const token = localStorage.getItem('token');
        const selectedDatabase = localStorage.getItem('selectedDatabase');
        
        if (!token || !selectedDatabase) {
          setError('Token ou base de données non définis.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/devis/devis-count-by-month-and-year/${selectedDatabase}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        

        if (response.status === 200 && response.data.devisCountByMonthAndYear) {
          setDevisData(response.data.devisCountByMonthAndYear);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des devis:', error);
        setError('Erreur lors de la récupération des devis.');
      } finally {
        setLoading(false);
      }
    };

    fetchDevisData();
  }, []);

  const chartData = {
    labels: devisData.map((item) => `${item.month}/${item.year}`), 
    datasets: [
      {
        label: 'Nombre de Devis',
        data: devisData.map((item) => item.totalDevis),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4, 
      },
    ],
  };

  useEffect(() => {
    const selectedDatabase = localStorage.getItem("selectedDatabase");

    if (!selectedDatabase) {
      setError("Le nom de la base de données n'est pas défini");
      setLoading(false);
      return;
    }

    const fetchTotalDevis = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/devis/${selectedDatabase}/devis/total`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        

        if (response.status === 200 && response.data) {
          setTotalDevis(response.data.totalDevis);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des devis :", error);
        setError("Erreur lors de la récupération des devis.");
      } finally {
        setLoading(false);
      }
    };

    fetchTotalDevis();
  }, [navigate]);


  

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 font-bold text-lg border-b border-gray-700">  
          Gestion des Devis
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            <li>
              <Link to="/" className="block hover:bg-gray-700 p-2 rounded">
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/DevisList"
                className="block hover:bg-gray-700 p-2 rounded"
              >
                Liste des Devis
              </Link>
            </li>
            <li>
              <Link
                to="/Devis-Form"
                className="block hover:bg-gray-700 p-2 rounded"
              >
                Créer un Devis
              </Link>
            </li>
            <li>
              <Link
                to="/clients"
                className="block hover:bg-gray-700 p-2 rounded"
              >
                Gestion des Clients
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="block hover:bg-gray-700 p-2 rounded"
              >
                Paramètres
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500">Total Devis</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {totalDevis !== null && !loading && (
              <p className="text-lg font-semibold text-gray-800">
                {totalDevis}
              </p>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500">Devis Validés</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500">Montant Total</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Statistiques Mensuelles</h2>
            <div className="h-80  rounded-lg">
              {loading ? (
                <div>Chargement des données...</div>
              ) : (
                <Line data={chartData} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
