import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import Chart from "chart.js/auto";

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

  useEffect(() => {
    const fetchDevisData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/devis/devis-by-month"
        );
        const data = await response.json();
        setDevisData(data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des devis :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDevisData();
  }, []);

  const chartData = {
    labels: devisData.map((item) => item.mois),
    datasets: [
      {
        label: "Nombre de Devis",
        data: devisData.map((item) => item.nombreDevis),
        borderColor: "rgba(75, 192, 192, 1)", // Couleur de la ligne
        backgroundColor: "rgba(7, 8, 8, 0.2)", // Couleur de la surface remplie
        fill: true, // Active le remplissage
        tension: 0.4, // Rend la ligne légèrement courbée
      },
    ],
  };

  const fetchTotalDevis = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/devis/total-devis"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch total devis");
      }
      const data = await response.json();
      setTotalDevis(data.totalDevis);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalDevis();
  }, []);

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

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Derniers Devis</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="p-2">#</th>
                  <th className="p-2">Client</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Montant</th>
                  <th className="p-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2">001</td>
                  <td className="p-2">Client A</td>
                  <td className="p-2">12/12/2024</td>
                  <td className="p-2">1200 €</td>
                  <td className="p-2 text-green-500">Validé</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">002</td>
                  <td className="p-2">Client B</td>
                  <td className="p-2">10/12/2024</td>
                  <td className="p-2">800 €</td>
                  <td className="p-2 text-yellow-500">En attente</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
