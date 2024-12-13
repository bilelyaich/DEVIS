import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Box, Check, Clipboard, Edit, Tag, Trash, User } from "react-feather";
import { PrinterIcon } from "@heroicons/react/20/solid";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

const DevisForm = () => {
  const [formData, setFormData] = useState({
    numDevis: "",
    pointVente: "",
    date: new Date().toISOString().split("T")[0],
    clientId: "",
    clientName: "",
    Code: "",
    commentaire: "",
    transport: "",
    delaiLivraison: "",
    lignes: [
      {
        famille: "",
        codeArt: "",
        libelle: "",
        unite: "",
        nbrunite: "",
        puht: "",
        remise: "",
        tva: "",
        puttc: "",
        netHt: "",
      },
    ],
    totalHt: "",
    remiseTotale: "",
    netHtGlobal: "",
    taxe: "",
    montantTtc: "",
    timbre: "",
    Av: {
      impot: "",
    },
    aPayer: "",
  });

  const formRef = useRef(null); // Déclare la référence avec une valeur initiale de null

  const navigate = useNavigate();

  const handlePrint = () => {
    const printContent = document.getElementById("devis");
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.outerHTML;
    window.print();
    document.body.innerHTML = originalContent;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowDevis(true);
  };

  const [clients, setClients] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [familles, setFamilles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [libelleOptions, setLibelleOptions] = useState([]);
  const [uniteOptions, setUniteOptions] = useState([]);
  const [nbruniteOptions, setNbruniteOptions] = useState([]);
  const [puhtOptions, setPuhtOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tauxtvaOptions, settauxtvaOptions] = useState([]);
  const [representantsCodes, setRepresentantsCodes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [codeFilter, setCodeFilter] = useState("");
  const [libelleFilter, setLibelleFilter] = useState("");
  const [familleFilter, setFamilleFilter] = useState("");
  const [devisList, setDevisList] = useState([]);
  const [selectedDevis, setSelectedDevis] = useState("");
  const [libpvList, setLibpvList] = useState([]);
  const [selectedLibpv, setSelectedLibpv] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDevis, setFilteredDevis] = useState([]);
  const [showDevis, setShowDevis] = useState(false);

  const filteredItems = filteredArticles.filter((article) => {
    const codeMatch = article.code
      .toLowerCase()
      .includes(codeFilter.toLowerCase());
    const libelleMatch = article.libelle
      .toLowerCase()
      .includes(libelleFilter.toLowerCase());
    return codeMatch && libelleMatch;
  });

  const filteredFamilles = familles.filter((famille) =>
    famille.toLowerCase().includes(familleFilter.toLowerCase())
  );

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/devis/clients"
        );
        console.log("Clients récupérés:", response.data);
        if (response.data.clients && response.data.clients.length > 0) {
          setClients(response.data.clients);
        } else {
          console.log("Aucun client trouvé");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des clients", error);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const fetchFamilles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/devis/familles"
        );
        console.log("Familles récupérées:", response.data);
        if (response.data.familles && response.data.familles.length > 0) {
          setFamilles(response.data.familles);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des familles", error);
      }
    };
    fetchFamilles();
  }, []);

  const handleFamilleChange = async (index, famille) => {
    const updatedLignes = [...formData.lignes];
    updatedLignes[index].famille = famille;

    setFormData({ ...formData, lignes: updatedLignes });

    try {
      const response = await axios.get(
        `http://localhost:5000/api/devis/codes/famille/${famille}`
      );
      if (response.data.articles) {
        setFilteredArticles(response.data.articles);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des articles pour la famille",
        error
      );
    }
  };
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleCodeArtChange = async (index, codeArt) => {
    const updatedLignes = [...formData.lignes];
    updatedLignes[index].codeArt = codeArt;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/devis/articles/details/${codeArt}`
      );
      if (response.data.article) {
        const article = response.data.article;
        updatedLignes[index].libelle = article.libelle;
        updatedLignes[index].unite = article.unite;
        updatedLignes[index].nbrunite = article.nbrunite;
        updatedLignes[index].puht = article.puht;
        updatedLignes[index].tauxtva = article.tauxtva;

        setLibelleOptions([article.libelle]);
        setUniteOptions([article.unite]);
        setNbruniteOptions([article.nbrunite]);
        setPuhtOptions([article.puht]);
        settauxtvaOptions([article.tauxtva]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'article", error);
    }

    setFormData({ ...formData, lignes: updatedLignes });
  };

  const handleClientChange = async (selectedOption) => {
    if (selectedOption) {
      const selectedCode = selectedOption.value;
      setFormData((prevData) => ({ ...prevData, codeClient: selectedCode }));

      if (selectedCode) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/devis/clients/code/${selectedCode}`
          );
          console.log("Clients récupérés:", response.data);
          const client = response.data.client;
          if (client) {
            setFormData((prevData) => ({
              ...prevData,
              rsoc: client.rsoc,
              adresse: client.adresse,
              cp: client.cp,
              email: client.email,
              tel1: client.tel1,
            }));
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des informations du client",
            error
          );
        }
      }
    } else {
      setFormData((prevData) => ({ ...prevData, codeClient: "" }));
    }
  };

  const handleRsocChange = async (selectedOption) => {
    if (selectedOption) {
      const selectedRsoc = selectedOption.value;
      setFormData((prevData) => ({ ...prevData, rsoc: selectedRsoc }));

      if (selectedRsoc) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/devis/clients/rsoc/${selectedRsoc}`
          );
          console.log("Client récupéré par raison sociale:", response.data);
          const client = response.data.client;

          if (client) {
            setFormData((prevData) => ({
              ...prevData,
              codeClient: client.code,
              adresse: client.adresse,
              cp: client.cp,
              email: client.email,
              tel1: client.tel1,
            }));
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des informations du client par rsoc",
            error
          );
        }
      }
    } else {
      setFormData((prevData) => ({ ...prevData, rsoc: "" }));
    }
  };
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/codes-representants"
        );
        console.log("Clients récupérés:", response.data);

        if (
          Array.isArray(response.data.Code) &&
          response.data.Code.length > 0
        ) {
          const formattedCodes = response.data.Code.map((code) => ({
            value: code,
            label: code,
          }));

          setRepresentantsCodes(formattedCodes);
        } else {
          console.log("Aucun client trouvé");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des clients", error);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/devis/devis"
        );
        setDevisList(response.data.devisList);
      } catch (error) {
        console.error("Erreur lors de la récupération des devis", error);
      }
    };

    fetchDevis();
  }, []);

  useEffect(() => {
    if (selectedDevis) {
      const fetchLibpv = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/devis/devis/libpv/${selectedDevis}`
          );
          setLibpvList([response.data.libpv]);
        } catch (error) {
          console.error("Erreur lors de la récupération du libpv", error);
        }
      };

      fetchLibpv();
    }
  }, [selectedDevis]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/SignInPage");
    }
  }, [navigate]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = devisList.filter((devis) =>
        devis.NUMBL.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDevis(filtered);
    } else {
      setFilteredDevis(devisList);
    }
  };

  const handleDevisChange = (selectedOption) => {
    if (selectedOption) {
      setFormData({
        ...formData,
        numDevis: selectedOption.value,
      });
      setSelectedDevis(selectedOption.value);
    } else {
      setFormData({
        ...formData,
        numDevis: "",
      });
      setSelectedDevis("");
    }
  };

  const handleLibpvChange = (event) => {
    setSelectedLibpv(event.target.value);
    console.log("Libpv sélectionné:", event.target.value);
  };

  const handleVendeurChange = (selectedOption) => {
    if (selectedOption) {
      setFormData({ ...formData, Code: selectedOption.value });
    } else {
      setFormData({ ...formData, Code: "" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleLigneChange = (index, field, value) => {
    const newLignes = [...formData.lignes];
    newLignes[index][field] = value;

    if (
      field === "quantite" ||
      field === "puht" ||
      field === "remise" ||
      field === "tauxtva"
    ) {
      const quantite = parseFloat(newLignes[index].quantite) || 0;
      const puht = parseFloat(newLignes[index].puht) || 0;
      const remise = parseFloat(newLignes[index].remise) || 0;
      const tauxtva = parseFloat(newLignes[index].tauxtva) || 0;

      console.log("Valeurs avant calculs :");
      console.log("nbrunite:", quantite);
      console.log("puht:", puht);
      console.log("remise:", remise);
      console.log("tauxtva:", tauxtva);

      const netHt = quantite * puht * (1 - remise / 100);
      console.log("Net HT (netHt):", netHt);

      const puttc = puht * (1 + tauxtva / 100);
      console.log("Prix unitaire TTC (puttc):", puttc);

      const mttc = netHt * (1 + tauxtva / 100);
      console.log("Montant TTC (mttc):", mttc);

      const taxe = mttc - netHt;
      console.log("Taxe (taxe):", taxe);

      newLignes[index].puttc = puttc.toFixed(3);
      newLignes[index].netHt = netHt.toFixed(3);
      newLignes[index].mttc = mttc.toFixed(3);
      newLignes[index].taxe = taxe.toFixed(3);
    }

    setFormData((prevData) => ({
      ...prevData,
      lignes: newLignes,
    }));

    updateTotals(newLignes);
  };

  const updateTotals = (lignes) => {
    let totalHt = 0;
    let remiseTotale = 0;
    let taxeTotale = 0;
    let montantTtcGlobal = 0;

    lignes.forEach((ligne) => {
      const totalHtLigne = parseFloat(ligne.netHt) || 0;
      const remiseLigne = parseFloat(ligne.remise) || 0;
      const tauxtvaLigne = parseFloat(ligne.tauxtva) || 0;

      remiseTotale += (totalHtLigne * remiseLigne) / 100;
      taxeTotale += totalHtLigne * (tauxtvaLigne / 100);
      montantTtcGlobal += parseFloat(ligne.mttc) || 0;
      totalHt += totalHtLigne;
    });

    const netHtGlobal = totalHt - remiseTotale;
    const montantTtc = montantTtcGlobal;

    const MONTANT_TTC_SEUIL_TIMBRE = 1000;
    const VALEUR_TIMBRE = 1.5;
    const timbre = montantTtc > MONTANT_TTC_SEUIL_TIMBRE ? VALEUR_TIMBRE : 0;

    const aPayer = montantTtc + timbre;

    setFormData((prevData) => ({
      ...prevData,
      totalHt: totalHt.toFixed(3),
      remiseTotale,
      netHtGlobal: netHtGlobal.toFixed(3),
      taxe: taxeTotale,
      montantTtc: montantTtc.toFixed(3),
      timbre,
      aPayer,
    }));
  };

  const addLigne = () => {
    setFormData({
      ...formData,
      lignes: [
        ...formData.lignes,
        {
          famille: "",
          codeArt: "",
          libelle: "",
          unite: "",
          nbrunite: "",
          puht: "",
          remise: "",
          tauxtva: "",
          puttc: "",
          netHt: "",
          ttc: "",
          taxe: "",
        },
      ],
    });
  };

  const removeLigne = (index) => {
    const updatedLignes = formData.lignes.filter((_, i) => i !== index);
    setFormData({ ...formData, lignes: updatedLignes });
  };

  const handleValidate = () => {
    setTableData([...tableData, ...formData.lignes]);
    setFormData({ lignes: [] });
  };

  const handleEdit = (index) => {
    console.log("Modifier la ligne à l'index:", index);
  };

  const handleDelete = (index) => {
    const updatedLignes = [...formData.lignes];
    updatedLignes.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      lignes: updatedLignes,
    }));
    console.log("Ligne supprimée à l'index:", index);
  };

  const clientOptionsByCode = clients.map((client) => ({
    value: client.code,
    label: client.code,
  }));

  const clientOptionsByRsoc = clients.map((client) => ({
    value: client.rsoc,
    label: client.rsoc,
  }));

  const devisOptions = devisList.map((devis) => ({
    value: devis.NUMBL,
    label: devis.NUMBL,
  }));

  return (
    <div>
      {!showDevis ? (
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-gray-50 rounded-lg space-y-6"
        >
          <nav className="bg-white w-full h-16 border-b border-gray-700 flex items-center px-6">
            <div className="flex space-x-8 items-center">
              <button
                type="button"
                onClick={addLigne}
                className="flex flex-col items-center"
              >
                <FontAwesomeIcon
                  icon={faFolderPlus}
                  className="text-blue-600 text-2xl"
                />
                <span className="text-sm font-semibold text-gray-700">
                  nauvaux
                </span>
              </button>
              <button className="flex flex-col items-center">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="text-yellow-600 text-2xl"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Modifier
                </span>
              </button>
              <button className="flex flex-col items-center">
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="text-red-600 text-2xl"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Supprimer
                </span>
              </button>
            </div>

            <div className="ml-auto flex items-center space-x-4">
              <button
                type="submit"
                className="flex items-center  text-white px-4 py-2 rounded-md"
              >
                <PrinterIcon className="h-6 w-6 text-black mr-2" />
                <span className="text-black font-semibold">Édition</span>
              </button>
            </div>
          </nav>

          <h2 className="text-black font-bold italic text-3xl">
            Devis / Facture Proforma
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <Tag className="text-black" />
                <span>Identifiants Devis</span>
              </h3>
              <div>
                <label className="block font-medium">N° Devis :</label>
                <Select
                  options={devisOptions}
                  onChange={handleDevisChange}
                  value={devisOptions.find(
                    (option) => option.value === formData.numDevis
                  )}
                  placeholder="Sélectionner un devis"
                  isSearchable
                />
              </div>
              <div>
                <label className="block font-medium">Point de vente :</label>
                <select
                  id="libpv"
                  value={selectedLibpv}
                  onChange={handleLibpvChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Choisir un point de vente</option>
                  {libpvList.map((libpv, index) => (
                    <option key={index} value={libpv}>
                      {libpv}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <User className="text-black" />
                <span>Information Client</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">Code Client :</label>
                  <Select
                    options={clientOptionsByCode}
                    onChange={handleClientChange}
                    value={clientOptionsByCode.find(
                      (option) => option.value === formData.codeClient
                    )}
                    placeholder="Sélectionner code"
                    isSearchable
                  />
                </div>

                <div>
                  <label className="block font-medium">Raison Sociale :</label>
                  <Select
                    options={clientOptionsByRsoc}
                    onChange={handleRsocChange}
                    value={clientOptionsByRsoc.find(
                      (option) => option.value === formData.rsoc
                    )}
                    placeholder="Sélectionner rsoc"
                    isSearchable
                  />
                </div>
                <div>
                  <label className="block font-medium">Adresse :</label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium">Code Postal :</label>
                  <input
                    type="text"
                    name="cp"
                    value={formData.cp}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium">Email :</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium">Téléphone :</label>
                  <input
                    type="text"
                    name="tel1"
                    value={formData.tel1}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <Clipboard className="text-black" />
                <span>Détails Devis</span>
              </h3>

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block font-medium">Date :</label>
                  <input
                    type="date"
                    name="date"
                    value={
                      formData.date || new Date().toISOString().split("T")[0]
                    }
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium">Pièce Liée :</label>
                  <input
                    type="text"
                    name="pieceLiee"
                    value={formData.pieceLiee}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  P.
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">Transport :</label>
                  <input
                    type="text"
                    name="transport"
                    value={formData.transport}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium">
                    À l'attention de :
                  </label>
                  <input
                    type="text"
                    name="aAttention"
                    value={formData.aAttention}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium">
                    Délai de livraison :
                  </label>
                  <input
                    type="text"
                    name="delaiLivraison"
                    value={formData.delaiLivraison}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <Edit className="text-black" />
                <span>Informations de l'Utilisateur</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">Vendeur :</label>
                  <Select
                    options={representantsCodes}
                    onChange={handleVendeurChange}
                    value={representantsCodes.find(
                      (option) => option.value === formData.Code
                    )}
                    placeholder=""
                    isSearchable
                  />
                </div>
                <div>
                  <label className="block font-medium">Secteur :</label>
                  <input
                    type="text"
                    name="secteur"
                    value={formData.secteur}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium">Commentaire :</label>
                  <input
                    type="text"
                    name="commentaire"
                    value={formData.commentaire}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium">Affaire :</label>
                  <input
                    type="text"
                    name="affaire"
                    value={formData.affaire}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {formData.lignes.map((ligne, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-md">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <Box className="text-black" />
                <span>Articles</span>
              </h3>
              <div className="grid grid-cols-6 gap-4 items-center">
                <div>
                  <div key={index}>
                    <label className="block font-medium">FAMILLE </label>

                    <Select
                      isClearable
                      value={{ label: ligne.famille, value: ligne.famille }}
                      onChange={(selectedOption) =>
                        handleFamilleChange(
                          index,
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      options={familles.map((famille) => ({
                        label: famille,
                        value: famille,
                      }))}
                      placeholder="Sélectionner ou taper une famille"
                      isSearchable
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block font-medium">CODE ARTICLE </label>

                  <input
                    type="text"
                    placeholder="Sélectionner un code article"
                    value={formData.lignes[index].codeArt}
                    onChange={(e) => handleCodeArtChange(index, e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={toggleModal}
                  />

                  {isModalOpen && (
                    <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex justify-center items-center">
                      <div className="bg-white w-[90%] max-h-[90vh] overflow-y-auto rounded-md p-4 shadow-lg relative">
                        <button
                          className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
                          onClick={() => setIsModalOpen(false)}
                        >
                          &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4">
                          Sélectionner un article
                        </h2>

                        <div className="mb-4">
                          <label className="block font-medium">
                            Filtrer par Code Article :
                          </label>
                          <input
                            type="text"
                            value={codeFilter}
                            onChange={(e) => setCodeFilter(e.target.value)}
                            placeholder="Filtrer par code"
                            className="border p-2 w-full rounded-md"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block font-medium">
                            Filtrer par Libellé :
                          </label>
                          <input
                            type="text"
                            value={libelleFilter}
                            onChange={(e) => setLibelleFilter(e.target.value)}
                            placeholder="Filtrer par libellé"
                            className="border p-2 w-full rounded-md"
                          />
                        </div>

                        <table className="min-w-full table-auto border-collapse border border-gray-300">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="p-3 text-left text-sm font-medium text-gray-600">
                                Code Article
                              </th>
                              <th className="p-3 text-left text-sm font-medium text-gray-600">
                                Libellé
                              </th>
                              <th className="p-3 text-left text-sm font-medium text-gray-600">
                                Unité
                              </th>
                              <th className="p-3 text-left text-sm font-medium text-gray-600">
                                PUHT
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-sm">
                            {filteredItems.map((article, idx) => (
                              <tr
                                key={idx}
                                onClick={() => {
                                  handleCodeArtChange(index, article.code);
                                  setIsModalOpen(false);
                                }}
                                className="cursor-pointer hover:bg-indigo-100 transition-all duration-150 ease-in-out"
                              >
                                <td className="p-3">{article.code}</td>
                                <td className="p-3">{article.libelle}</td>
                                <td className="p-3">{article.unite}</td>
                                <td className="p-3">
                                  {article.puht.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block font-medium">LIBELLE </label>

                  <input
                    type="text"
                    placeholder="libelle"
                    value={ligne.libelle}
                    onChange={(e) =>
                      handleLigneChange(index, "libelle", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium">UNITE </label>

                  <input
                    type="text"
                    placeholder="unite"
                    value={ligne.unite}
                    onChange={(e) =>
                      handleLigneChange(index, "unite", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium">Nbr/Uté </label>

                  <input
                    type="text"
                    placeholder="nbrunite"
                    value={ligne.nbrunite}
                    onChange={(e) =>
                      handleLigneChange(index, "nbrunite", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-medium">P.U.H.T</label>

                  <input
                    type="text"
                    step="0.001"
                    placeholder="puht"
                    value={(parseFloat(ligne.puht) || 0).toFixed(3)}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        handleLigneChange(index, "puht", value);
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-4 items-center">
                <div>
                  <label className="block font-medium">REMISE </label>

                  <input
                    type="text"
                    step="0.001"
                    placeholder="remise"
                    value={(parseFloat(ligne.remise) || 0).toFixed(3)}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        handleLigneChange(index, "remise", value);
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-medium">T.V.A </label>
                  <input
                    type="text"
                    placeholder="tauxtva"
                    value={ligne.tauxtva || ""}
                    onChange={(e) =>
                      handleLigneChange(index, "tauxtva", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium">P.U.T.T.C </label>

                  <input
                    type="text"
                    placeholder="puttc"
                    value={ligne.puttc}
                    onChange={(e) =>
                      handleLigneChange(index, "puttc", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-medium">MT NET H.T</label>
                  <input
                    type="text"
                    placeholder="netHt"
                    value={ligne.netHt}
                    onChange={(e) =>
                      handleLigneChange(index, "netHt", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium">QUANTITE</label>
                  <input
                    type="text"
                    placeholder="quantite"
                    value={ligne.quantite}
                    onChange={(e) =>
                      handleLigneChange(index, "quantite", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex space-x-2 justify-end">
                <button
                  onClick={() => handleValidate(index)}
                  className="text-green-500"
                  title="Valider"
                >
                  <Check />
                </button>
                <button
                  onClick={() => handleEdit(index)}
                  className="text-blue-500"
                  title="Modifier"
                >
                  <Edit />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500"
                  title="Supprimer"
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}

          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {" "}
                <th className="border border-gray-300 p-2">Famille</th>
                <th className="border border-gray-300 p-2">Code Article</th>
                <th className="border border-gray-300 p-2">libelle</th>
                <th className="border border-gray-300 p-2">Unité</th>
                <th className="border border-gray-300 p-2">Quantité</th>
                <th className="border border-gray-300 p-2">PUHT</th>
                <th className="border border-gray-300 p-2">Remise</th>
                <th className="border border-gray-300 p-2">TVA</th>
                <th className="border border-gray-300 p-2">PUTTC</th>
                <th className="border border-gray-300 p-2">Net HT</th>
              </tr>
            </thead>

            <tbody>
              {tableData.map((ligne, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">
                    {ligne.famille}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {ligne.codeArt}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {" "}
                    {ligne.libelle}{" "}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {ligne.quantite}
                  </td>
                  <td className="border border-gray-300 p-2">{ligne.puht}</td>
                  <td className="border border-gray-300 p-2">{ligne.remise}</td>
                  <td className="border border-gray-300 p-2">{ligne.tva}</td>
                  <td className="border border-gray-300 p-2">{ligne.puttc}</td>
                  <td className="border border-gray-300 p-2">{ligne.unite}</td>
                  <td className="border border-gray-300 p-2">{ligne.netHt}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="block font-medium">Montant HT :</label>
              <input
                type="text"
                name="totalHt"
                value={formData.totalHt}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                readOnly
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block font-medium">Remise Totale :</label>
              <input
                type="text"
                name="remiseTotale"
                value={formData.remiseTotale}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                readOnly
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block font-medium">Net HT Global :</label>
              <input
                type="text"
                name="netHtGlobal"
                value={formData.netHtGlobal}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                readOnly
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block font-medium">Taxe :</label>
              <input
                type="text"
                name="taxe"
                value={formData.taxe}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                readOnly
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block font-medium">Montant TTC :</label>
              <input
                type="text"
                name="montantTtc"
                value={formData.montantTtc}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                readOnly
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block font-medium">Timbre :</label>
              <input
                type="text"
                name="timbre"
                value={formData.timbre}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                readOnly
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block font-medium">À Payer :</label>
              <input
                type="text"
                name="aPayer"
                value={formData.aPayer}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                readOnly
              />
            </div>
          </div>
        </form>
      ) : (
        <div>
          <div
            id="devis"
            className="p-6 bg-white rounded-lg shadow-lg max-w-screen-lg mx-auto"
          >
            <div className="grid grid-cols-2 border-b border-gray-300 pb-4 mb-6">
              <div>
                <h1 className="text-black font-bold italic text-3xl">
                  Ste Logicom - Progiciel de Gestion Intégrée ERP
                </h1>

                <p className="text-sm text-gray-600">
                  S.A.R.L au capital de 11.000 DT
                  <br />
                  BIAT HARZALLAH 08 700 00040 10 52971444
                  <br />
                  Tél/Fax: 74 400110 - 74 461010
                  <br />
                  RC: B141691998
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-bold text-black">
                  Devis/Facture Proforma
                </h2>
                <p>
                  <strong>Numéro:</strong> {formData.numDevis}
                  <br />
                  <strong>Date:</strong> {formData.date}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-gray-300 pb-4 mb-6">
              <div>
                <p>
                  <strong>Code:</strong> {formData.codeClient}
                </p>
                <p>
                  <strong>Raison Sociale:</strong> {formData.rsoc}
                </p>
                <p>
                  <strong>Adresse:</strong> {formData.adresse}
                </p>
                <p>
                  <strong>Code Postal:</strong> {formData.cp}
                </p>
                <p>
                  <strong>Email:</strong> {formData.email}
                </p>
                <p>
                  <strong>Téléphone:</strong> {formData.tel1}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto mb-6">
              <h2 className="text-black font-bold italic text-center">
                Détails des Lignes
              </h2>
              <table className="table-auto w-full border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    {[
                      "Famille",
                      "Code Article",
                      "Libellé",
                      "Unité",
                      "Nbr Unité",
                      "PU HT",
                      "Remise",
                      "TVA %",
                      "PU TTC",
                      "Net HT",
                    ].map((header) => (
                      <th
                        key={header}
                        className="border border-gray-300 px-2 py-1 text-left text-sm"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {formData.lignes.map((ligne, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-1 text-sm">
                        {ligne.famille}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-sm">
                        {ligne.codeArt}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-sm">
                        {ligne.libelle}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-sm">
                        {ligne.unite}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-sm">
                        {ligne.nbrunite}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-sm">
                        {ligne.puht}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-sm">
                        {ligne.remise}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-sm">
                        {ligne.tauxtva}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-sm">
                        {ligne.puttc}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-sm">
                        {ligne.netHt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between space-x-6">
              <div className="mb-4">
                <table className="table-auto border-collapse border border-gray-300 w-full">
                  <thead></thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        tauxtva
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formData.tva}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">base</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formData.base}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Montants
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formData.taxe}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className=" p-4 rounded-lg border border-gray-300 mb-6 w-1/3">
                <h2 className="text-black font-bold italic text-center">
                  Notes
                </h2>

                <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        Délai de Livraison:
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formData.delaiLivraison}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        Transport:
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formData.transport}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        Mode de Paiement:
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formData.modePaiement}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-4  p-4 rounded-lg border border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Cacher & Signature
                  </h3>
                  <div className="h-16 border-dashed border-gray-500 flex justify-center items-center"></div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-300 mb-6 w-1/3">
                <h2 className="text-black font-bold italic text-center">
                  Informations Financières
                </h2>

                <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        Total HT:
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formData.totalHt}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        Remise Totale:
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formData.remiseTotale}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        Net HT Global:
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formData.netHtGlobal}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        Taxe:
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formData.taxe}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        Total TTC:
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formData.montantTtc}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        Timbre:
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formData.timbre}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        Montant à Payer:
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formData.aPayer}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg focus:outline-none"
                onClick={handlePrint}
              >
                <PrinterIcon className="h-6 w-6 inline-block mr-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevisForm;
