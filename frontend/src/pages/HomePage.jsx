import React from "react";
import { Link } from "react-router-dom";
import {
  FaRegHandshake,
  FaPhoneAlt,
  FaInfoCircle,
  FaTwitter,
  FaLinkedinIn,
  FaFacebookF,
} from "react-icons/fa";

function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="bg-white shadow-xl py-8">
        <div className="container mx-auto flex justify-between items-center px-8">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-20 h-20 object-contain mr-4"
            />
            <span className="text-2xl font-bold text-teal-500">
              Demande de Devis
            </span>
          </div>

          <nav>
            <ul className="flex space-x-10 text-lg font-medium text-gray-800">
              <li>
                <a
                  href="#services"
                  className="hover:text-teal-500 transition duration-300 transform hover:scale-105"
                >
                  <FaRegHandshake className="inline-block text-teal-500" />{" "}
                  <span>Services</span>
                </a>
              </li>

              <li>
                <Link
                  to="/SignInPage"
                  className="hover:text-teal-500 transition duration-300"
                >
                  Connexion
                </Link>
              </li>
              <li>
                <Link
                  to="/SignUpPage"
                  className="hover:text-teal-500 transition duration-300"
                >
                  Inscription
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 py-24 text-center text-white">
        <h2 className="text-5xl font-bold mb-4">
          Obtenez votre devis rapidement
        </h2>
        <p className="text-xl mb-8">
          Remplissez le formulaire ci-dessous pour recevoir une estimation
          personnalisée.
        </p>
      </section>

      <section id="services" className="bg-white py-24 px-8">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-semibold text-gray-800 mb-12">
            Nos Services
          </h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="border-2 border-teal-500 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <FaRegHandshake className="text-teal-600 text-4xl mb-6 mx-auto" />
              <h4 className="text-xl font-medium text-gray-800 mb-3">
                Consultation
              </h4>
              <p className="text-gray-600">
                Recevez des conseils experts et des recommandations
                personnalisées pour votre projet.
              </p>
            </div>
            <div className="border-2 border-teal-500 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <FaPhoneAlt className="text-teal-600 text-4xl mb-6 mx-auto" />
              <h4 className="text-xl font-medium text-gray-800 mb-3">
                Support 24/7
              </h4>
              <p className="text-gray-600">
                Notre équipe est disponible à tout moment pour répondre à vos
                questions.
              </p>
            </div>
            <div className="border-2 border-teal-500 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <FaInfoCircle className="text-teal-600 text-4xl mb-6 mx-auto" />
              <h4 className="text-xl font-medium text-gray-800 mb-3">
                Formation
              </h4>
              <p className="text-gray-600">
                Des formations spécialisées pour vous aider à maîtriser nos
                outils et services.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <h4 className="text-2xl font-semibold mb-4">Contactez-nous</h4>
              <p className="text-lg mb-6">
                N'hésitez pas à nous contacter pour toute question ou demande
                spécifique.
              </p>
              <a
                href="mailto:contact@devise.com"
                className="bg-teal-500 text-white px-8 py-3 rounded-full text-lg hover:bg-teal-400 transition duration-300 transform hover:scale-105"
              >
                Contactez-nous
              </a>
            </div>

            <div className="text-center">
              <h4 className="text-2xl font-semibold mb-4">À propos de nous</h4>
              <p className="text-lg mb-6">
                Une équipe de professionnels engagés à fournir des services de
                qualité pour vos devis.
              </p>
              <Link
                to="/about"
                className="bg-teal-500 text-white px-8 py-3 rounded-full text-lg hover:bg-teal-400 transition duration-300 transform hover:scale-105"
              >
                En savoir plus
              </Link>
            </div>

            <div className="text-center">
              <h4 className="text-2xl font-semibold mb-4">Suivez-nous</h4>
              <p className="text-lg mb-6">
                Restez informé avec nos dernières mises à jour et offres.
              </p>
              <div className="flex justify-center space-x-6">
                <a
                  href="https://facebook.com"
                  className="text-teal-500 hover:text-teal-400 text-3xl transition duration-300"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://twitter.com"
                  className="text-teal-500 hover:text-teal-400 text-3xl transition duration-300"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://linkedin.com"
                  className="text-teal-500 hover:text-teal-400 text-3xl transition duration-300"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 border-t border-gray-700 pt-6">
            <p className="text-lg">
              © 2024 Demande de Devis. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
