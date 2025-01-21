import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignInPage() {
  const [nom, setNom] = useState("");  
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedNom = nom.trim();  
    const trimmedPassword = password.trim();  

    if (!trimmedNom || !trimmedPassword) {
      setError("Tous les champs doivent être remplis");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: trimmedNom,
          motpasse: trimmedPassword,
        }),
      });
      

      const data = await response.json();

      console.log("Réponse du serveur:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("societies", JSON.stringify(data.societies));

        navigate("/SocietiesList"); 
      } else {
        setError(data.message || "Erreur de connexion. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/m.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex bg-white bg-opacity-80 rounded-lg shadow-md w-full max-w-4xl">
        <div className="hidden md:flex items-center justify-center w-1/2 p-6">
          <img
            src="/logo.png"
            alt="Logo"
            className="max-w-full h-auto object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Connexion
          </h2>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="nom"
                className="block text-gray-700 font-semibold mb-2"
              >
                Nom d'utilisateur
              </label>
              <input
                type="text"  
                id="nom"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez votre nom d'utilisateur"
                value={nom}
                onChange={(e) => setNom(e.target.value)}  
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold mb-2"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-300"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
