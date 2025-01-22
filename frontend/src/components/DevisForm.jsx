import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Box,
  Check,
  Clipboard,
  Edit,
  Link,
  Tag,
  Trash,
  User,
} from "react-feather";
import {
  CheckIcon,
  PencilIcon,
  PrinterIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faEdit,
  faTrashAlt,
  faSearch,
  faArrowLeft,
  faArrowRight,
  faList,
  faSignOutAlt,
  faTimes,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DevisForm = () => {
  const [formData, setFormData] = useState({
    NUMBL: "",
    pointVente: "",
    DATEBL: new Date().toISOString().split("T")[0],

    CODEREP: "",
    RSREP: "",
    adresse: "",
    cp: "",
    rsoc: "",
    email: "",
    tel1: "",
    code: "",
    MTTC: "",
    numPage: 1,
    commentaire: "",
    transport: "",
    delaiLivraison: "",
    lignes: [
      {
        famille: "",
        code: "",
        libelle: "",
        unite: "",
        nbrunite: "",
        prix1: "",
        Remise: "",
        tauxtva: "",
        puttc: "",
        netHt: "",
        CONFIG: "",
      },
    ],
    totalHt: "",
    remiseTotale: "",
    netHtGlobal: "",
    taxe: "",
    timbre: "",
    
    Av: {
      impot: "",
    },
    aPayer: "",
  });

  const { dbName } = useParams();
  const totalPages = Math.ceil(formData.lignes.length / 10);

  const formRef = useRef(null);

  const navigate = useNavigate();

  const handleEditDevis = (selectedDevis) => {
    setFormData({
      ...selectedDevis,
      DATEBL: selectedDevis.DATEBL || new Date().toISOString().split("T")[0],
      lignes: selectedDevis.lignes || [],
    });
  };
  
  const handlePrint = () => {
    const printContent = document.getElementById("devis");
    if (!printContent) {
      console.error("Aucun contenu à imprimer.");
      return;
    }
  
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.outerHTML;
  
    window.print();
  
    // Restaurer le contenu initial
    document.body.innerHTML = originalContent;
    window.location.reload(); // Recharge la page pour éviter des comportements inattendus
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
  const [configOptions, setCONFIGOptions] = useState([]);
  const [showConfigPopup, setShowConfigPopup] = useState(false);
  const [configItems, setConfigItems] = useState([]);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState(null);
  const [activeConfigIndex, setActiveConfigIndex] = useState(null);
  const [messages, setMessages] = useState({});
  const [selectedDatabase, setSelectedDatabase] = useState(
    localStorage.getItem("selectedDatabase")
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [devisOptions, setDevisOptions] = useState([]);
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const [isNewLineVisible, setIsNewLineVisible] = useState(false);
  const [devisDetails, setDevisDetails] = useState(null);
  const [lignes, setlignes] = useState([]);
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [representants, setRepresentants] = useState([]);
  const [isNewMode, setIsNewMode] = useState(false);
  const [selectedDevisIndex, setSelectedDevisIndex] = useState(0);
  const [initialFormData, setInitialFormData] = useState(formData);
  const [initialLines, setInitialLines] = useState(formData.lignes);
  const [Lignes, setLignes] = useState([]);
  const [lignesValidees, setLignesValidees] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);

  const filteredItems = filteredArticles.filter((article) => {
    const codeMatch = article.code
      .toLowerCase()
      .includes(codeFilter.toLowerCase());
    const libelleMatch = article.libelle
      .toLowerCase()
      .includes(libelleFilter.toLowerCase());
    return codeMatch && libelleMatch;
  });

  


 

  const cancelEditMode = () => {
    setIsEditMode(false);
  };


  const validateEditMode = () => {
  
    setIsEditMode(false);
  };

  const filteredFamilles = familles.filter((famille) =>
    famille.toLowerCase().includes(familleFilter.toLowerCase())
  );

  const toggleModal = (index) => {
    setSelectedBoxIndex(index);
    setIsModalOpen(true);
  };
  useEffect(() => {
    const fetchClients = async () => {
      if (!selectedDatabase) {
        console.error("Le nom de la base de données n'est pas défini");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/devis/${selectedDatabase}/clients`
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
  }, [selectedDatabase]);

  useEffect(() => {
    const fetchFamilles = async () => {
      if (!selectedDatabase) {
        console.error("Le nom de la base de données n'est pas défini");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/devis/${selectedDatabase}/familles`
      );
      
       console.log("Familles récupérées :", response.data);

        if (response.data.familles && response.data.familles.length > 0) {
          setFamilles(response.data.familles);
        } else {
          console.log("Aucune famille trouvée");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des familles", error);
      }
    };

    fetchFamilles();
  }, [selectedDatabase]);

  const handleFamilleChange = async (index, famille) => {
    const updatedLignes = [...formData.lignes];
    updatedLignes[index].famille = famille;

    setFormData({ ...formData, lignes: updatedLignes });

    if (!famille) {
      console.error("La famille est requise.");
      return;
    }

    if (!selectedDatabase) {
      console.error("Le nom de la base de données n'est pas défini.");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/devis/${selectedDatabase}/codes/famille/${famille}`
    );
    
      console.log("Réponse de l'API :", response.data);

      if (response.data.articles && response.data.articles.length > 0) {
        setFilteredArticles(response.data.articles);
      } else {
        console.warn("Aucun article trouvé pour la famille", famille);
        setFilteredArticles([]);
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

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleCodeArtChange = async (index, code) => {
    if (!code || code.trim() === "") {
      console.error("Le code de l'article est requis.");
      return;
    }

    const updatedLignes = [...formData.lignes];
    updatedLignes[index].code = code; 

    setFormData({ ...formData, lignes: updatedLignes });

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/devis/${selectedDatabase}/articles/details/${code}`
    );
    
      if (response.data.article) {
        const article = response.data.article;
        updatedLignes[index].libelle = article.libelle;
        updatedLignes[index].unite = article.unite;
        updatedLignes[index].nbrunite = article.nbrunite;
        updatedLignes[index].prix1 = article.prix1;
        updatedLignes[index].tauxtva = article.tauxtva;
        updatedLignes[index].CONFIG = article.CONFIG;

        setLibelleOptions([article.libelle]);
        setUniteOptions([article.unite]);
        setNbruniteOptions([article.nbrunite]);
        setPuhtOptions([article.prix1]);
        settauxtvaOptions([article.tauxtva]);
        setCONFIGOptions([article.CONFIG]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'article", error);
    }

    setFormData({ ...formData, lignes: updatedLignes });
  };

  const handleConfigChange = (index, newConfigValue) => {
    const updatedLignes = [...formData.lignes];
    updatedLignes[index].CONFIG = newConfigValue;

    setFormData({ ...formData, lignes: updatedLignes });

    updateConfig(index, newConfigValue);
  };

  const updateConfig = async (index, newConfigValue) => {
    const codeArt = formData.lignes[index].codeArt;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/devis/${selectedDatabase}/articles/${codeArt}/updateConfig`,
        { codeart: codeArt, newConfigValue }
    );
    

      if (response.status === 200) {
        const updatedLignes = [...formData.lignes];
        updatedLignes[index].CONFIG = response.data.updatedArticle.CONFIG;
        setFormData({ ...formData, lignes: updatedLignes });

        setMessages((prevMessages) => ({
          ...prevMessages,
          [index]: "Configuration mise à jour avec succès !",
        }));

        setTimeout(() => {
          setMessages((prevMessages) => {
            const updatedMessages = { ...prevMessages };
            delete updatedMessages[index];
            return updatedMessages;
          });
        }, 3000);
      } else {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [index]: "Erreur de mise à jour de la configuration.",
        }));

        setTimeout(() => {
          setMessages((prevMessages) => {
            const updatedMessages = { ...prevMessages };
            delete updatedMessages[index];
            return updatedMessages;
          });
        }, 3000);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la configuration", error);

      setMessages((prevMessages) => ({
        ...prevMessages,
        [index]: "Une erreur est survenue lors de la mise à jour.",
      }));

      setTimeout(() => {
        setMessages((prevMessages) => {
          const updatedMessages = { ...prevMessages };
          delete updatedMessages[index];
          return updatedMessages;
        });
      }, 3000);
    }
  };

  const handleSaveConfig = async (index) => {
    const newConfigValue = formData.lignes[index].CONFIG;
    await updateConfig(index, newConfigValue);
    setShowConfigPopup(false);
    setActiveConfigIndex(null);
  };
  const handleClientChange = async (selectedOption) => {
    if (selectedOption) {
      const selectedCode = selectedOption.value;
      setFormData((prevData) => ({ ...prevData, code: selectedCode }));

      if (selectedCode) {
        try {
          const dbName = localStorage.getItem("selectedDatabase");
          if (!dbName) {
            console.error("Aucune base de données sélectionnée.");
            return;
          }

    
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/devis/${dbName}/clients/code/${selectedCode}`
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
      setFormData((prevData) => ({ ...prevData, code: "" })); 
    }
  };

  const handleRsocChange = async (selectedOption) => {
    if (selectedOption) {
      const selectedRsoc = selectedOption.value;
      setFormData((prevData) => ({ ...prevData, rsoc: selectedRsoc }));

      if (selectedRsoc) {
        try {
          const dbName = localStorage.getItem("selectedDatabase");
          if (!dbName) {
            console.error("Aucune base de données sélectionnée.");
            return;
          }

          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/devis/${dbName}/clients/rsoc/${selectedRsoc}`
        );
        
          console.log("Client récupéré par raison sociale:", response.data);
          const client = response.data.client;

          if (client) {
            setFormData((prevData) => ({
              ...prevData,
              code: client.code,
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
    console.log("selectedDevis avant requête:", selectedDevis);
    const fetchLibpv = async () => {
      try {
        const dbName = localStorage.getItem("selectedDatabase");
        if (!dbName) {
          console.error("Aucune base de données sélectionnée.");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/devis/${dbName}/devis/libpv/${selectedDevis}`
      );
      
        console.log("Réponse API:", response.data);
        if (response.data && response.data.libpv) {
          setLibpvList([response.data.libpv]);
          console.log("Libpv list mise à jour:", [response.data.libpv]);
        } else {
          console.log("Aucun libpv trouvé dans la réponse", response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du libpv", error);
      }
    };

    if (selectedDevis) {
      fetchLibpv();
    } else {
      console.log(
        "selectedDevis est vide ou invalide, la requête n'est pas effectuée."
      );
    }
  }, [selectedDevis]);

  useEffect(() => {
    console.log("Libpv list mise à jour:", libpvList);
  }, [libpvList]);

  const handleLibpvChange = (event) => {
    setSelectedLibpv(event.target.value);
    console.log("Libpv sélectionné:", event.target.value);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;

    console.log("Date sélectionnée:", newDate);

    setFormData((prevData) => ({
      ...prevData,
      date: newDate,
    }));

    fetchNumbl(newDate);
  };

  const fetchNumbl = async (datebl) => {
    if (!selectedDatabase) {
      alert("Veuillez sélectionner une base de données.");
      return;
    }

    try {
      console.log(
        "Appel API pour générer le numéro de devis avec date:",
        datebl
      );

      let formattedDate;
      if (datebl.includes("/")) {
        const dateParts = datebl.split("/");
        formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      } else {
        formattedDate = datebl;
      }

      console.log("Date formatée envoyée à l'API:", formattedDate);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/devis/${selectedDatabase}/last-numbl?datebl=${formattedDate}`
    );
    
      const data = await response.json();

      if (response.ok) {
        console.log("Numéro de devis généré:", data.newNUMBL);

        setFormData((prevData) => ({
          ...prevData,
          NUMBL: data.newNUMBL, 
        }));

        setDevisOptions((prevOptions) => [
          ...prevOptions,
          { value: data.newNUMBL, label: data.newNUMBL },
        ]);
      } else {
        console.error(data.message);
        alert(
          "Erreur lors de la génération du numéro de devis : " + data.message
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API :", error);
      alert("Erreur lors de l'appel à l'API : " + error.message);
    }
  };

  useEffect(() => {
    const selectedDatabase = localStorage.getItem("selectedDatabase");

    if (!selectedDatabase) {
      setError("Base de données introuvable.");
      return;
    }

    fetchDevisList(selectedDatabase); 
  }, []);

  const fetchDevisList = async (database) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Utilisateur non authentifié.");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/get-devis-details/${database}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    

      console.log("Réponse de l'API :", response);

      if (response.status === 200) {
        const { devis } = response.data;
        setDevisList(devis);
        setSelectedDevisIndex(0); 
        fetchDevisDetails(database, devis[0].numbl);
      } else {
        setError("Aucun devis trouvé.");
      }
    } catch (error) {
      setError("Erreur serveur lors de la récupération des devis.");
    }
  };


  const fetchDevisDetails = async (database, NUMBL) => {
    try {
      console.log("Chargement des détails du devis pour numbl : ", NUMBL);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Utilisateur non authentifié.");
        return;
      }

   
      setFormData({
        ...formData,
        lignes: [],
      });

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/get-devis-details/${database}/${NUMBL}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    

      if (response.status === 200) {
        const devisData = response.data.devis[0];
        const dfpDevis = devisData.dfpDetails;
        const lignes = devisData.lignes;

    
        localStorage.setItem("lignesValidees", JSON.stringify(lignes));

        setDevisDetails(dfpDevis);
        setlignes(lignes);

        setFormData({
          ...formData,
          NUMBL: dfpDevis.NUMBL,
          ADRCLI: dfpDevis.ADRCLI,
          CODECLI: dfpDevis.CODECLI,
          cp: dfpDevis.cp,
          email: dfpDevis.email || "",
          tel1: dfpDevis.tel1 || "",
          rsoc: dfpDevis.rsoc || "",
          totalHt: dfpDevis.MHT,
          MTTC: dfpDevis.MTTC,
          CODEREP: dfpDevis.CODEREP,
          RSREP: dfpDevis.RSREP || "",
          comm: dfpDevis.comm || "",
        });
      } else {
        setError("Aucun devis trouvé.");
      }
    } catch (error) {
      setError("Erreur serveur lors de la récupération du devis.");
    }
  };

 
  useEffect(() => {
    const savedLignes = localStorage.getItem("lignesValidees");
    if (savedLignes) {
      setlignes(JSON.parse(savedLignes));
    }
  }, []);

  const handleDevisNavigation = (direction) => {
    const newIndex = selectedDevisIndex + direction;

    if (newIndex < 0 || newIndex >= devisList.length) {
      setError("Aucun autre devis disponible.");
      return;
    }

    const newNumbl = devisList[newIndex].numbl;
    setSelectedDevisIndex(newIndex);
    const selectedDatabase = localStorage.getItem("selectedDatabase");

    if (!selectedDatabase) {
      setError("Base de données introuvable.");
      return;
    }


    localStorage.setItem("selectedDevisNumbl", newNumbl);

    fetchDevisDetails(selectedDatabase, newNumbl); // Charger le nouveau devis
  };

  useEffect(() => {
    const selectedDatabase = localStorage.getItem("selectedDatabase");
    const selectedNumbl = localStorage.getItem("selectedDevisNumbl");

    if (!selectedDatabase) {
      setError("Base de données introuvable.");
      return;
    }

    if (selectedNumbl) {
      fetchDevisDetails(selectedDatabase, selectedNumbl);
    } else {
      setError("Numéro de devis introuvable.");
    }
  }, []);

  const handleDevisChange = (selectedOption) => {
    if (selectedOption) {
      setFormData({
        ...formData,
        NUMBL: selectedOption.value,
      });
      fetchDevisDetails(selectedOption.value);
    } else {
      setFormData({
        ...formData,
        NUMBL: "",
      });
    }
  };

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

  useEffect(() => {
    const fetchRepresentants = async () => {
      try {
        const dbName = localStorage.getItem("selectedDatabase");
        if (!dbName) {
          console.error("Aucune base de données sélectionnée.");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/devis/get-representant-details/${dbName}/${formData}`
      );
      

        console.log("Réponse complète de l'API:", response);

        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          setRepresentants(response.data.data);
        } else {
          console.error("Aucun représentant trouvé dans la réponse");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des représentants",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRepresentants();
  }, [formData.CODEREP]);

  const representantsOptions = representants.map((representant) => ({
    value: representant.CODEREP,
    label: representant.CODEREP,
  }));

 
  const representantsSocieteOptions = representants.map((representant) => ({
    value: representant.RSREP,
    label: representant.RSREP,
  }));

 
  const handleVendeurChange = (selectedOption) => {
    if (selectedOption) {
      const selectedCode = selectedOption.value;

  
      const selectedRepresentant = representants.find(
        (representant) => representant.CODEREP === selectedCode
      );

    
      setFormData((prevData) => ({
        ...prevData,
        CODEREP: selectedCode,
        RSREP: selectedRepresentant ? selectedRepresentant.RSREP : "",
      }));
    } else {
   
      setFormData((prevData) => ({ ...prevData, CODEREP: "", RSREP: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "date") {
      fetchNumbl(value);
    }
  };

  const handleLigneChange = (index, field, value) => {
    const newLignes = [...formData.lignes];
    newLignes[index][field] = value;

    setFormData({ ...formData, lignes: newLignes });

    if (
      field === "quantite" ||
      field === "prix1" ||
      field === "remise" ||
      field === "tauxtva"
    ) {
      const quantite = parseFloat(newLignes[index].quantite) || 0;
      const prix1 = parseFloat(newLignes[index].prix1) || 0;
      const remise = parseFloat(newLignes[index].remise) || 0;
      const tauxtva = parseFloat(newLignes[index].tauxtva) || 0;

      console.log("Valeurs avant calculs :");
      console.log("nbrunite:", quantite);
      console.log("puht:", prix1);
      console.log("remise:", remise);
      console.log("tauxtva:", tauxtva);

      const netHt = quantite * prix1 * (1 - remise / 100);
      console.log("Net HT (netHt):", netHt);

      const puttc = prix1 * (1 + tauxtva / 100);
      console.log("Prix unitaire TTC (puttc):", puttc);

      const MTTC = netHt * (1 + tauxtva / 100);
      console.log("Montant TTC (mttc):", MTTC);

      const taxe = MTTC - netHt;
      console.log("Taxe (taxe):", taxe);

      newLignes[index].puttc = puttc.toFixed(3);
      newLignes[index].netHt = netHt.toFixed(3);
      newLignes[index].MTTC = MTTC.toFixed(3);
      newLignes[index].taxe = taxe.toFixed(3);

      const totalTVA = newLignes.reduce((acc, ligne) => {
        return acc + (parseFloat(ligne.taxe) || 0);
      }, 0);

      setFormData((prevData) => ({
        ...prevData,
        lignes: newLignes,
        totalTVA: totalTVA.toFixed(3),
      }));
    }

    updateTotals(newLignes);
  };

  const updateTotals = (lignes) => {
    let totalHt = 0;
    let remiseTotale = 0;
    let taxeTotale = 0;
    let montantTtcGlobal = 0;

    lignes.forEach((ligne) => {
      const totalHtLigne = parseFloat(ligne.netHt) || 0;
      const remiseLigne = parseFloat(ligne.Remise) || 0;
      const tauxtvaLigne = parseFloat(ligne.tauxtva) || 0;

      remiseTotale += (totalHtLigne * remiseLigne) / 100;
      taxeTotale += totalHtLigne * (tauxtvaLigne / 100);
      montantTtcGlobal += parseFloat(ligne.MTTC) || 0;
      totalHt += totalHtLigne;
    });

    const netHtGlobal = totalHt - remiseTotale;
    const MTTC = montantTtcGlobal;

    const MONTANT_TTC_SEUIL_TIMBRE = 1000;
    const VALEUR_TIMBRE = 1;
    const timbre = MTTC > MONTANT_TTC_SEUIL_TIMBRE ? VALEUR_TIMBRE : 0;

    const aPayer = MTTC + timbre;

    setFormData((prevData) => ({
      ...prevData,
      totalHt: totalHt.toFixed(3),
      remiseTotale,
      netHtGlobal: netHtGlobal.toFixed(3),
      taxe: taxeTotale,
      MTTC: MTTC.toFixed(3),
      timbre,
      aPayer,
    }));
  };

  const addLigne = () => {
    setIsNewMode(true);
    setInitialFormData(formData);

    setFormData({
      ...formData,
      NUMBL: "",
      CODECLI: "",
      rsoc: "",
      CODEREP: "",
      RSREP: "",
      comm: "",
      totalHt: 0.0,
      remiseTotale: 0.0,
      netHtGlobal: 0.0,
      taxe: 0.0,
      MTTC: 0.0,
      timbre: 0.0,
      aPayer: 0.0,
      lignes: [
        {
          code: "",
          libelle: "",
          nbrunite: "",
          prix1: "",
          tauxtva: "",
          unite: "",
          famille: "",
          Remise: "",
          CONFIG: "",
          isVisible: true,
        },
      ],
    });

    setlignes([
      {
        code: "",
        libelle: "",
        nbrunite: "",
        prix1: "",
        tauxtva: "",
        unite: "",
        famille: "",
        Remise: "",
        CONFIG: "",
        isVisible: true,
      },
    ]);
  };

  const removeLigne = (index) => {
    const updatedLignes = formData.lignes.filter((_, i) => i !== index);
    setFormData({ ...formData, lignes: updatedLignes });
  };

  const handleInputChange = (index, field, value) => {
    const updatedLignes = [...formData.lignes];
    updatedLignes[index][field] = value;
    setFormData({ ...formData, lignes: updatedLignes });
  };

  const handleValidate = (index, e) => {
    e.preventDefault();

    let isValid = true;
    const ligneActuelle = formData.lignes[index];

    if (
      !ligneActuelle.code ||
      !ligneActuelle.libelle ||
      !ligneActuelle.unite ||
      isNaN(ligneActuelle.prix1) ||
      isNaN(ligneActuelle.nbrunite) ||
      isNaN(ligneActuelle.tauxtva) ||
      ligneActuelle.tauxtva < 0
    ) {
      isValid = false;
    }

    if (isValid) {
      const quantite = parseFloat(ligneActuelle.quantite) || 0;
      const prix1 = parseFloat(ligneActuelle.prix1) || 0;
      const remise = parseFloat(ligneActuelle.Remise) || 0;
      const tauxtva = parseFloat(ligneActuelle.tauxtva) || 0;

      const montantHT = quantite * prix1;
      const montantRemise = (montantHT * remise) / 100;
      const netHT = montantHT - montantRemise;
      const taxe = (netHT * tauxtva) / 100;
      const montantTTC = netHT + taxe;

      const ligneValidee = {
        ...ligneActuelle,
        montantHT: montantHT.toFixed(3),
        montantTTC: montantTTC.toFixed(3),
        remise: montantRemise.toFixed(3),
        netHT: netHT.toFixed(3),
        taxe: taxe.toFixed(3),
      };

      let lignesValidees =
        JSON.parse(localStorage.getItem("lignesValidees")) || [];
      lignesValidees.push(ligneValidee);

      localStorage.setItem("lignesValidees", JSON.stringify(lignesValidees));

      setLignesValidees(lignesValidees);

      const totalMontantHT = lignesValidees.reduce(
        (acc, ligne) => acc + parseFloat(ligne.montantHT),
        0
      );
      const totalRemise = lignesValidees.reduce(
        (acc, ligne) => acc + parseFloat(ligne.remise),
        0
      );
      const totalNetHT = lignesValidees.reduce(
        (acc, ligne) => acc + parseFloat(ligne.netHT),
        0
      );
      const totalTaxe = lignesValidees.reduce(
        (acc, ligne) => acc + parseFloat(ligne.taxe),
        0
      );
      const totalTTC = lignesValidees.reduce(
        (acc, ligne) => acc + parseFloat(ligne.montantTTC),
        0
      );

      setFormData((prevData) => ({
        ...prevData,
        lignes: prevData.lignes.map((ligne, ligneIndex) =>
          ligneIndex === index
            ? {
                code: "",
                libelle: "",
                nbrunite: "",
                prix1: "",
                tauxtva: "",
                unite: "",
                famille: "",
                netHt: "",
                Remise: "",
                quantite: "",
                CONFIG: "",
                isVisible: true,
              }
            : ligne
        ),
        totalHt: totalMontantHT.toFixed(3),
        Remise: totalRemise.toFixed(3),
        netHtGlobal: totalNetHT.toFixed(3),
        taxe: totalTaxe.toFixed(3),
        MTTC: totalTTC.toFixed(3),
      }));
    } else {
      console.log(
        "Formulaire invalide, veuillez remplir tous les champs correctement."
      );
    }
  };

  useEffect(() => {
    const lignesEnLocalStorage = JSON.parse(
      localStorage.getItem("lignesValidees")
    );
    if (lignesEnLocalStorage) {
      setLignesValidees(lignesEnLocalStorage);
    }
  }, []);

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

  function numberToText(number) {
    if (number === undefined || number === null || isNaN(number)) {
      console.error("Valeur invalide pour numberToText:", number);
      return "Valeur invalide";
    }
  
    const units = [
      "",
      "un",
      "deux",
      "trois",
      "quatre",
      "cinq",
      "six",
      "sept",
      "huit",
      "neuf",
      "dix",
      "onze",
      "douze",
      "treize",
      "quatorze",
      "quinze",
      "seize",
      "dix-sept",
      "dix-huit",
      "dix-neuf",
      "vingt",
      "trente",
      "quarante",
      "cinquante",
      "soixante",
      "soixante-dix",
      "quatre-vingts",
      "quatre-vingt-dix",
    ];
    const tens = [
      "",
      "",
      "vingt",
      "trente",
      "quarante",
      "cinquante",
      "soixante",
      "septante",
      "huitante",
      "nonante",
    ];
  
    const convertPart = (num) => {
      if (num < 20) return units[num];
      else if (num < 100) {
        const ten = Math.floor(num / 10);
        const unit = num % 10;
        return `${tens[ten]}${unit ? "-" + units[unit] : ""}`;
      } else {
        return `${units[Math.floor(num / 100)]} cent${
          num % 100 !== 0 ? " " + convertPart(num % 100) : ""
        }`;
      }
    };
  
    const [intPart, decPart] = number.toString().split(".");
    const intText = convertPart(Number(intPart));
  
    if (decPart) {
      const decText = convertPart(Number(decPart));
      return `${intText} dinars et ${decText} millimes`;
    }
  
    return `${intText} dinars`;
  }
  

  const handleSearchClick = () => {
    navigate("/recherche");
  };

  const toggleBox = (index) => {
    const newLignes = [...formData.lignes];
    newLignes[index].isVisible = !newLignes[index].isVisible;
    setFormData({ ...formData, lignes: newLignes });
  };

  const handleShowDevis = () => {
    setShowDevis(true);
  };

  const calculerTaxe = () => {
    const taxe = parseFloat(formData.MTTC) - parseFloat(formData.totalHt);
    return isNaN(taxe) ? 0 : taxe.toFixed(3);
  };

  const calculerRemiseTotale = () => {
    return articles
      .reduce((total, article) => {
        const quantite = parseFloat(article.QteART) || 0;
        const puht = parseFloat(article.PUART) || 0;
        const remise = parseFloat(article.Remise) || 0;

        const remiseArticle = quantite * puht * (remise / 100);
        return total + remiseArticle;
      }, 0)
      .toFixed(3);
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      remiseTotale: calculerRemiseTotale(),
    }));
  }, [articles]);

  const handlecommChange = (selectedOption) => {
    setFormData({
      ...formData,
      comm: selectedOption ? selectedOption.value : "",
    });
  };

  const cancelNewMode = () => {
    setIsNewMode(false);
    setFormData(initialFormData);
    setInitialLines(initialLines);
    toast.info("Annulation des modifications");
    const isConfirmed = window.confirm(
      "Êtes-vous sûr de vouloir annuler les modifications ?"
    );
    if (isConfirmed) {
      console.log("Modifications annulées");
    }
  };

  const validateNewMode = async (event) => {
    event.preventDefault();
  
    const savedLignes = localStorage.getItem("lignesValidees");
  
    if (!savedLignes) {
      console.error("Aucun article trouvé dans le localStorage.");
      return;
    }
  
    const lignes = JSON.parse(savedLignes);
  
    if (!Array.isArray(lignes) || lignes.length === 0) {
      console.error("Les articles sont vides ou mal formatés.");
      return;
    }
  
    const dataToSend = {
      NUMBL: formData.NUMBL,
      adresse: formData.adresse,
      libpv: formData.libpv,
      code: formData.code,
      DATEBL: formData.DATEBL,
      MREMISE: formData.MREMISE,
      MTTC: formData.MTTC,
      comm: formData.comm,
      RSREP: formData.RSREP,
      CODEREP: formData.CODEREP,
      articles: lignes.map((ligne) => ({
        code: ligne.code,
        libelle: ligne.libelle,
        nbrunite: ligne.nbrunite,
        prix1: ligne.prix1,
        tauxtva: ligne.tauxtva,
        unite: ligne.unite,
        famille: ligne.famille,
        Remise: ligne.Remise,
        CONFIG: ligne.CONFIG,
      })),
    };
  
    try {
      const dbName = localStorage.getItem("selectedDatabase");
      if (!dbName) {
        console.error("Aucune base de données sélectionnée.");
        return;
      }
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/devis/${dbName}/create`,
        dataToSend
      );
  
      // Vérifiez ici si les données reçues contiennent ce dont vous avez besoin
      console.log("Données reçues de l'API :", response.data);
  
      // Mettre à jour les données avec toutes les informations nécessaires
      setFormData({
        NUMBL: response.data.NUMBL || "", // Vérification si le champ existe
        code: response.data.code || "", // Vérification si le champ existe
        RSOC: response.data.RSOC || "", // Ajout de RSOC si disponible
        lignes: Array.isArray(response.data.lignes) ? response.data.lignes : [], // Gestion des lignes
      });
  
      setIsNewMode(false); // Désactiver le mode création
      setLignes([]); // Réinitialiser les lignes
  
      localStorage.removeItem("lignesValidees"); // Supprimer les lignes du localStorage
      console.log("Les lignes validées ont été supprimées du localStorage.");
    } catch (error) {
      console.error("Erreur lors de la création du devis :", error);
    }
  };
  

  const handleUpdateDevis = async () => {
    try {
      const token = localStorage.getItem("token");
      const database = localStorage.getItem("selectedDatabase");

      if (!token) {
        setError("Utilisateur non authentifié.");
        return;
      }

      if (!database) {
        setError("Aucune base de données sélectionnée.");
        return;
      }

      if (!formData || !formData.NUMBL) {
        setError("Les données du formulaire sont incomplètes.");
        return;
      }

      const savedLignes = localStorage.getItem("lignesValidees");
      if (!savedLignes) {
        console.error("Aucun article trouvé dans le localStorage.");
        return;
      }

      const lignes = JSON.parse(savedLignes);

      if (!Array.isArray(lignes) || lignes.length === 0) {
        console.error("Les articles sont vides ou mal formatés.");
        return;
      }

      const formattedLignes = lignes.map((ligne) => ({
        CodeART: ligne.code || "",
        DesART: ligne.libelle || "",
        QteART: ligne.nbrunite || 0,
        PUART: ligne.prix1 || 0,
        Remise: ligne.Remise || 0,
        TauxTVA: ligne.tauxtva || 0,
        Unite: ligne.unite || "",
        Conf: ligne.CONFIG || "",
        famille: ligne.famille || "",
        nbun: ligne.nbrunite || 0,
      }));

      setIsNewMode(true);

      const newLigne = {
        CodeART: "",
        DesART: "",
        QteART: 0,
        PUART: 0,
        Remise: 0,
        TauxTVA: 0,
        Unite: "",
        Conf: "",
        famille: "",
        nbun: 0,
        isVisible: true,
      };

      setFormData((prevFormData) => ({
        ...prevFormData,
        lignes: [newLigne, ...prevFormData.lignes],
      }));

 
      const requestBody = {
        NUMBL: formData.NUMBL || "",
        code: formData.CODECLI || "",
        rsoc: formData.rsoc || "",
        articles: formattedLignes,
        MREMISE: formData.MREMISE || 0,
        MTTC: formData.MTTC || 0,
        rsoc: formData.rsoc || "",
        CODEREP: formData.CODEREP || "",
        RSREP: formData.RSREP || "",
        comm: formData.comm || "",
      };

      console.log("Données envoyées :", requestBody);

      // Envoi de la requête PUT
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/devis/${database}/${formData.NUMBL}`,
        requestBody,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    
      if (response.status === 200) {
        alert("Devis modifié avec succès !");

     
        setIsNewMode(true); 
      } else {
        setError(
          response.data.message || "Erreur lors de la modification du devis."
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API :", error);
      setError("Erreur serveur lors de la modification du devis.");
    }
  };

  return (
    <div>
      {!showDevis ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleShowDevis();
          }}
          className="p-6 bg-gray-50 rounded-lg space-y-6"
        >
          <nav className="bg-white w-full h-[110px] border-b border-gray-700 flex items-center px-6">
          <div className="flex space-x-4">
      {!isNewMode && !isEditMode ? (
        <>
          <button
            type="button"
            onClick={addLigne}
            className="flex flex-col items-center border p-2 rounded-md hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faFolderPlus} className="text-blue-600 text-3xl" />
            <span className="text-sm font-semibold text-gray-700">Nouveaux</span>
          </button>
          <div className="border-r border-gray-300 h-8"></div>
      
          <button
            type="button"
            className="flex flex-col items-center border p-2 rounded-md hover:bg-gray-100"
            onClick={handleUpdateDevis}
          >
            <FontAwesomeIcon icon={faEdit} className="text-yellow-600 text-3xl" />
            <span className="text-sm font-semibold text-gray-700">Modifier</span>
          </button>
          <div className="border-r border-gray-300 h-8"></div>
       
          <button
            type="button"
            onClick={removeLigne}
            className="flex flex-col items-center border p-2 rounded-md hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faTrashAlt} className="text-red-600 text-3xl" />
            <span className="text-sm font-semibold text-gray-700">Supprimer</span>
          </button>
          <div className="border-r border-gray-300 h-8"></div>
  
          <button
            onClick={handleSearchClick}
            className="flex flex-col items-center border p-2 rounded-md hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faSearch} className="text-blue-600 text-3xl" />
            <span className="text-sm font-semibold text-gray-700">Rechercher</span>
          </button>

          <button
            type="button"
            className="flex items-center text-gray-700 border p-2 rounded-md hover:bg-gray-100"
            onClick={() => handleDevisNavigation(-1)} 
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-3xl" />
          </button>

          <button
            type="button"
            className="flex items-center text-gray-700 border p-2 rounded-md hover:bg-gray-100"
            onClick={() => handleDevisNavigation(1)} 
          >
            <FontAwesomeIcon icon={faArrowRight} className="text-3xl" />
          </button>
          <button
            type="button"
            onClick={() => navigate("/DevisList")}
            className="flex items-center text-gray-700 ml-4 border p-2 rounded-md hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faList} className="text-3xl" />
            <span className="ml-2 text-sm font-semibold text-gray-700">Liste</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center text-gray-700 ml-4 border p-2 rounded-md hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="text-3xl" />
            <span className="ml-2 text-sm font-semibold text-gray-700">Quitter</span>
          </button>
        </>
      ) : isNewMode ? (
        <>
          <button
            type="button"
            onClick={cancelNewMode}
            className="flex items-center text-gray-700 border p-2 rounded-md hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faTimes} className="text-3xl" />
            <span className="ml-2 text-sm font-semibold text-gray-700">Annuler</span>
          </button>
          <div className="border-r border-gray-300 h-8"></div>
   
          <button
            type="button"
            onClick={validateNewMode}
            className="flex items-center text-gray-700 border p-2 rounded-md hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faCheck} className="text-3xl" />
            <span className="ml-2 text-sm font-semibold text-gray-700">Valider</span>
          </button>
        </>
      ) : isEditMode ? (
        <>
          <button
            type="button"
            onClick={cancelEditMode}
            className="flex items-center text-gray-700 border p-2 rounded-md hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faTimes} className="text-3xl" />
            <span className="ml-2 text-sm font-semibold text-gray-700">Annuler</span>
          </button>
          <div className="border-r border-gray-300 h-8"></div>
     
          <button
            type="button"
            onClick={handleUpdateDevis}
            className="flex items-center text-gray-700 border p-2 rounded-md hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faCheck} className="text-3xl" />
            <span className="ml-2 text-sm font-semibold text-gray-700">Valider</span>
          </button>
        </> 
      ) : null}
    </div>

            <div className="flex justify-center space-x-8 flex-grow">
   
            </div>

            <div className="ml-auto flex items-center space-x-4">
              <button
                type="submit"
                className="flex items-center text-white px-4 py-2 rounded-md border p-2 hover:bg-gray-100"
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
              <label className="block font-medium">N° Devis :</label>
              {formData.NUMBL ? (
                <input
                  type="text"
                  name="NUMBL "
                  value={formData.NUMBL || ""}
                  readOnly
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              ) : (
                <Select
                  options={devisOptions}
                  onChange={handleDevisChange}
                  value={
                    devisOptions.find(
                      (option) => option.value === formData.NUMBL
                    ) || null
                  }
                  placeholder="Sélectionner un devis"
                  isSearchable
                />
              )}

              <div className="mt-4">
                <label className="block font-medium">Point de vente :</label>
                <input
                  id="libpv"
                  value={selectedLibpv || "SIEGE LOCAL"}
                  onChange={handleLibpvChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            <div>
              <div className="space-y-4 p-4 border rounded-md">
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                  <User className="text-black" />
                  <span>Information Client</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Champs informations client */}
                  <div>
  <label className="block font-medium">
    {isNewMode || formData.CODECLI === "" ? "Code :" : "Code Client :"}
  </label>
  {isNewMode || formData.CODECLI === "" ? (
    // En mode création, afficher un Select
    <Select
      options={clientOptionsByCode}
      onChange={handleClientChange}
      value={clientOptionsByCode.find((option) => option.value === formData.CODECLI)}
      placeholder="Sélectionner un client"
      isSearchable
      className="w-full"
    />
  ) : (
    // En mode affichage, afficher un input en lecture seule
    <input
      type="text"
      name="CODECLI"
      value={formData.CODECLI}
      readOnly
      className="w-full border border-gray-300 rounded-md p-2"
    />
  )}
</div>


                  <div>
                    <label className="block font-medium">RSCLI :</label>
                    {isNewMode || formData.rsoc === "" ? (
                      <Select
                        options={clientOptionsByRsoc}
                        onChange={handleRsocChange}
                        value={clientOptionsByRsoc.find(
                          (option) => option.value === formData.rsoc
                        )}
                        placeholder="Sélectionner RSCLI"
                        isSearchable
                        className="w-full"
                      />
                    ) : (
                      <input
                        type="text"
                        name="rsoc"
                        value={formData.rsoc}
                        readOnly
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block font-medium">Adresse :</label>
                    {isNewMode ? (
                      <input
                        type="text"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    ) : (
                      <input
                        type="text"
                        name="ADRCLI"
                        value={formData.ADRCLI}
                        readOnly
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block font-medium">Code Postal :</label>
                    {isNewMode ? (
                      <input
                        type="text"
                        name="cp"
                        value={formData.cp}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    ) : (
                      <input
                        type="text"
                        name="cp"
                        value={formData.cp}
                        readOnly
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block font-medium">Email :</label>
                    {isNewMode ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    ) : (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block font-medium">Téléphone :</label>
                    {isNewMode ? (
                      <input
                        type="text"
                        name="tel1"
                        value={formData.tel1}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    ) : (
                      <input
                        type="text"
                        name="tel1"
                        value={formData.tel1}
                        readOnly
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    )}
                  </div>
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
                    onChange={(e) => {
                      const newDate = e.target.value;

                      setFormData({
                        ...formData,
                        date: newDate,
                      });

                      fetchNumbl(newDate);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const date = e.target.value;
                        fetchNumbl(date);
                      }
                    }}
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
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 col-span-1">
                  <div className="w-full">
                    <label className="block font-medium">Vendeur :</label>
                    {isNewMode ? ( // Vérifie si isNewMode est true
                      <Select
                        options={representantsOptions}
                        onChange={handleVendeurChange}
                        value={representantsOptions.find(
                          (option) => option.value === formData.CODEREP
                        )}
                        placeholder="Sélectionner un vendeur"
                        isSearchable
                        className="w-full rounded-md p-2"
                      />
                    ) : (
                      <input
                        type="text"
                        name="coderep"
                        value={formData.CODEREP || "Aucun vendeur défini"}
                        readOnly
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 col-span-1">
                  <div className="w-full">
                    <label className="block font-medium">RSREP</label>
                    {formData.numbl ? (
                      <input
                        type="text"
                        name="RSREP"
                        value={formData.RSREP || ""}
                        readOnly
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    ) : (
                      <input
                        type="text"
                        name="RSREP"
                        value={formData.RSREP || ""}
                        readOnly
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 col-span-1">
                  <div className="w-full">
                    <label className="block font-medium">Secteur :</label>
                    <input
                      type="text"
                      name="secteur"
                      value={formData.secteur}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block font-medium">Commentaire :</label>
                {isNewMode || (formData.numbl && formData.comm === "") ? (
                  <textarea
                    name="comm"
                    value={formData.comm || ""}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                ) : (
                  <textarea
                    name="comm"
                    value={formData.comm || ""}
                    readOnly
                    rows="3"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                )}
              </div>

              <div className="w-full mt-4">
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

          {formData.lignes.map((ligne, index) => (
            <div
              key={ligne.id}
              className="space-y-4 p-4 border rounded-md mt-4"
            >
              {ligne.isVisible && (
                <div className="space-y-4 p-4 border rounded-md mt-4">
                  <h3 className="text-lg font-bold">Articles </h3>

                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div>
                      <label className="block font-medium">FAMILLE</label>
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
                      />
                    </div>

                    <div className="relative">
                      <label className="block font-medium">CODE ARTICLE</label>
                      <input
                        type="text"
                        placeholder="Sélectionner un code article"
                        value={ligne.code}
                        onChange={(e) =>
                          handleCodeArtChange(index, e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onClick={() => toggleModal(index)}
                      />
                      {isModalOpen && selectedBoxIndex === index && (
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
                                onChange={(e) =>
                                  setLibelleFilter(e.target.value)
                                }
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
                                  <th className="p-3 text-left text-sm font-medium text-gray-600">
                                    tauxtva
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
                                      {article.prix1.toFixed(2)}
                                    </td>
                                    <td className="p-3">
                                      {article.tauxtva.toFixed(2)}
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
                      <label className="block font-medium">LIBELLE</label>
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
                      <label className="block font-medium">UNITE</label>
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

                    <div className="relative">
                      <label className="block font-medium">CONFIG</label>
                      <input
                        type="text"
                        placeholder="CONFIG"
                        value={ligne.CONFIG || ""}
                        onChange={(e) =>
                          handleLigneChange(index, "CONFIG", e.target.value)
                        }
                        onFocus={() => setShowConfigPopup(index)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {messages[index] && (
                        <p className="text-sm mt-1 text-green-500 font-medium">
                          {messages[index]}
                        </p>
                      )}
                      {showConfigPopup === index && (
                        <div
                          className="absolute top-full left-0 mt-2 w-[600px] bg-white border border-gray-300 rounded-md shadow-lg z-10"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <div className="p-4">
                            <h4 className="font-bold text-sm mb-2">
                              Modifier CONFIG
                            </h4>
                            <textarea
                              value={ligne.CONFIG || ""}
                              onChange={(e) =>
                                handleLigneChange(
                                  index,
                                  "CONFIG",
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              rows="4"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveConfig(index)}
                              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
                            >
                              Sauvegarder
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div>
                      <label className="block font-medium">REMISE</label>
                      <input
                        type="text"
                        step="0.001"
                        placeholder="Remise"
                        value={(parseFloat(ligne.Remise) || 0).toFixed(3)}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value)) {
                            handleLigneChange(index, "Remise", value);
                          }
                        }}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block font-medium">T.V.A</label>
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
                      <label className="block font-medium">P.U.T.T.C</label>
                      <input
                        type="text"
                        step="0.001"
                        placeholder="puttc"
                        value={ligne.puttc || ""}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value)) {
                            handleLigneChange(index, "puttc", value);
                          }
                        }}
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
                    <div className="flex-1">
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
                    <div className="flex space-x-4">
                   <div className="flex-1">
                        <label className="block font-medium">P.U.H.T</label>
                        <input
                          type="text"
                          step="0.001"
                          placeholder="prix1"
                          value={(parseFloat(ligne.prix1) || 0).toFixed(3)}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value)) {
                              handleLigneChange(index, "prix1", value);
                            }
                          }}
                          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

            
                      <div className="flex-1">
                        <label className="block font-medium">Collisage</label>
                        <input
                          type="text"
                          placeholder=""
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value)) {
                              handleLigneChange(index, "collisage", value);
                            }
                          }}
                          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 justify-end">
           
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const isFormValid = handleValidate(index, e);
                        if (isFormValid) {
                          console.log("Formulaire valide, ligne sauvegardée.");
                        } else {
                          console.log("Veuillez remplir tous les champs.");
                        }
                      }}
                      className="text-green-500 p-2 border rounded-lg hover:bg-green-100"
                      title="Valider"
                    >
                      <CheckIcon className="h-6 w-6" />
                    </button>

          
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-500 p-2 border rounded-lg hover:bg-blue-100"
                      title="Modifier"
                    >
                      <PencilIcon className="h-6 w-6" />
                    </button>

                 
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500 p-2 border rounded-lg hover:bg-red-100"
                      title="Supprimer"
                    >
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="flex flex-col min-h-screen">
            <div className="overflow-x-auto flex-grow">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">Famille</th>
                    <th className="border border-gray-300 p-2">Code Article</th>
                    <th className="border border-gray-300 p-2">Libelle</th>
                    <th className="border border-gray-300 p-2">Unité</th>
                    <th className="border border-gray-300 p-2">Quantité</th>
                    <th className="border border-gray-300 p-2">Remise</th>
                    <th className="border border-gray-300 p-2">TVA</th>
                    <th className="border border-gray-300 p-2">PUHT</th>
                    <th className="border border-gray-300 p-2">PUTTC</th>
                    <th className="border border-gray-300 p-2">NET HT</th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.length > 0 &&
                    lignes
                      .filter((ligne) => ligne.QteART && ligne.PUART)
                      .map((ligne, index) => {
                        const quantite = parseFloat(ligne.QteART) || 0;
                        const prix1 = parseFloat(ligne.PUART) || 0;
                        const remise = parseFloat(ligne.Remise) || 0;
                        const tauxtva = parseFloat(ligne.TauxTVA) || 0;

                        const netHt =
                          quantite && prix1
                            ? quantite * prix1 * (1 - remise / 100)
                            : 0;
                        const puttc =
                          prix1 && tauxtva ? prix1 * (1 + tauxtva / 100) : 0;

                        return (
                          <tr key={index}>
                            <td className="border border-gray-300 p-2">
                              {ligne.famille || ""}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {ligne.CodeART || ""}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {ligne.DesART || ""}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {ligne.Unite || ""}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {quantite || ""}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {remise !== 0 ? `${remise}%` : ""}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {tauxtva || ""}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {prix1 || ""}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {puttc || ""}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {netHt || ""}
                            </td>
                          </tr>
                        );
                      })}
                  {lignesValidees.length > 0 &&
                    lignesValidees
                      .filter((ligne) => ligne.nbrunite && ligne.prix1)
                      .map((ligne, idx) => (
                        <tr key={idx} className="border-b hover:bg-indigo-100">
                          <td className="border border-gray-300 p-2">
                            {ligne.famille || ""}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {ligne.code || ""}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {ligne.libelle || ""}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {ligne.unite || ""}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {ligne.nbrunite || ""}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {ligne.Remise || "0"}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {ligne.tauxtva || ""}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {ligne.prix1 || ""}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {ligne.puttc || ""}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {ligne.netHt || ""}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-300 p-4 sticky bottom-0 w-full">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block font-medium">Montant HT :</label>
                  <input
                    type="text"
                    name="totalHt"
                    value={formData.totalHt}
                    className="w-full border rounded-md p-2"
                    readOnly
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block font-medium">Remise Totale :</label>
                  <input
                    type="text"
                    name="Remise"
                    value={formData.Remise}
                    className="w-full border rounded-md p-2"
                    readOnly
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block font-medium">Net HT Global :</label>
                  <input
                    type="text"
                    name="netHtGlobal"
                    value={formData.totalHt}
                    className="w-full border rounded-md p-2"
                    readOnly
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block font-medium">Taxe :</label>
                  <input
                    type="text"
                    name="taxe"
                    value={calculerTaxe()}
                    className="w-full border rounded-md p-2"
                    readOnly
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block font-medium">Montant TTC :</label>
                  <input
                    type="text"
                    name="MTTC"
                    value={formData.MTTC}
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
                    className="w-full border rounded-md p-2"
                    readOnly
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block font-medium">À Payer :</label>
                  <input
                    type="text"
                    name="aPayer"
                    value={formData.MTTC}
                    className="w-full border rounded-md p-2"
                    readOnly
                  />
                </div>
              </div>
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
                  <strong>Numéro:</strong>
                  {formData.NUMBL}
                  <br />
                  <strong>Date:</strong> {formData.date}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-300 pt-4 mt-6">
              <div className="flex flex-col gap-2">
                <p className="border p-2 text-sm">
                  <strong>DATE:</strong> {formData.date}
                </p>
                <p className="border p-2 text-sm">
                  <strong>CLIENT:</strong>
                  {formData.CODECLI}
                </p>
                <p className="border p-2 text-sm">
                  <strong>PAGE:</strong>
                  {formData.numPage}/{totalPages}
                </p>
                <p className="mt-4 text-sm text-gray-700">
                  Monsieur / Madame, suite à votre demande, nous avons le
                  plaisir de vous communiquer notre meilleure offre de prix pour
                  :
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="border p-2 text-sm">
                  <strong>Raison Sociale:</strong> {formData.rsoc}
                </p>
                <p className="border p-2 text-sm">
                  <strong>Adresse:</strong> {formData.ADRCLI}
                </p>
                <p className="border p-2 text-sm">
                  <strong>Code Postal:</strong> {formData.cp}
                </p>
                <p className="border p-2 text-sm">
                  <strong>Email:</strong> {formData.email}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto mb-6">
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

            <div className="flex justify-between gap-6">
              <div className="w-1/3 p-4  rounded-lg">
                <table className="table-auto w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1">
                        Taux TVA
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {formData.lignes[0]?.tauxtva || 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1">Base</td>
                      <td className="border border-gray-300 px-2 py-1">
                        {formData.lignes
                          .reduce(
                            (acc, ligne) => acc + parseFloat(ligne.netHt || 0),
                            0
                          )
                          .toFixed(3)}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1">
                        Montants
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {formData.taxe || 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 font-bold text-right">
                        Total Taxe
                      </td>
                      <td className="border border-gray-300 px-2 py-1 font-bold">
                        {formData.taxe || 0}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-4 p-2 border border-gray-300 rounded-lg inline-block">
                  <p className="text-right text-sm font-medium">
                    Arrêter la présentation de devise à la somme:{" "}
                    <span className="text-black font-semibold">
                      {numberToText(formData.taxe)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="w-1/3 prounded-lg">
                <table className="table-auto w-full mt-4 border-collapse">
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

                <div className="mt-4 p-4 border border-gray-300 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Cachet & Signature
                  </h3>
                  <div className="h-16 border-dashed border-gray-500 flex justify-center items-center"></div>
                </div>
              </div>

              <div className="w-1/3 p-4  rounded-lg">
                <table className="table-auto w-full text-sm border-collapse">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 font-medium">
                        Total HT:
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {formData.totalHt}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 font-medium">
                        Net HT Global:
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {formData.totalHt}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 font-medium">
                        Total TAXES:
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {formData.taxe}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 font-medium">
                        MT T.T.C:
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {formData.MTTC}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 font-medium">
                        Timbre:
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {formData.timbre}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 font-medium">
                        Montant à Payer:
                      </td>
                      <td className="border border-gray-300 px-2 py-1 font-bold">
                        {formData.MTTC}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div>
                  <p className="fixed bottom-0 left-0 w-full text-center text-gray-600 text-xs">
                    Espérons que notre offre trouve votre entière satisfaction,
                    veuillez agréer, Monsieur/Madame, nos sentiments les plus
                    distingués.
                  </p>
                </div>
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
