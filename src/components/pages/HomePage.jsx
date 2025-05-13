import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="bg-blue-900 text-white py-6 shadow-md">
        <div className=" mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">F-BANKY</h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-blue-900 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              S'inscrire
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 transition"
            >
              Se connecter
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-100 to-white py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4 text-blue-800">
          Une nouvelle façon de gérer votre argent
        </h2>
        <p className="text-lg max-w-2xl mx-auto text-gray-700">
          F-BANKY vous offre une plateforme bancaire moderne, rapide et
          sécurisée. Accédez à vos comptes, effectuez des virements, suivez vos
          transactions, le tout en quelques clics.
        </p>
      </section>

      {/* Services */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              Comptes Bancaires
            </h3>
            <p>
              Gérez vos comptes courants et épargnes en ligne, à tout moment.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              Paiements & Virements
            </h3>
            <p>
              Effectuez des paiements sécurisés et rapides, locaux ou
              internationaux.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              Support Client 24/7
            </h3>
            <p>
              Une assistance humaine, disponible en permanence pour vous
              accompagner.
            </p>
          </div>
        </div>
      </section>

      {/* Sécurité */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6 text-blue-800">
          Sécurité de vos données
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg">
          Chez F-BANKY, la sécurité est notre priorité. Nous utilisons un
          chiffrement de niveau bancaire, une authentification multi-facteurs
          (MFA), et une surveillance en temps réel des activités suspectes.
        </p>
      </section>

      {/* Valeurs */}
      <section className="bg-blue-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-800">Nos valeurs</h2>
          <p className="text-gray-700 mb-6">
            F-BANKY est fondée sur la transparence, la confiance et
            l’innovation. Nous mettons la technologie au service de vos
            finances, tout en restant proches de vous.
          </p>
          <div className="flex justify-center gap-4">
            <span className="bg-white px-4 py-2 rounded-md shadow text-blue-800 font-medium">
              Fiabilité
            </span>
            <span className="bg-white px-4 py-2 rounded-md shadow text-blue-800 font-medium">
              Innovation
            </span>
            <span className="bg-white px-4 py-2 rounded-md shadow text-blue-800 font-medium">
              Accessibilité
            </span>
          </div>
        </div>
      </section>

      {/* Opérations bancaires */}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold mb-10 text-blue-800">
          Ce que vous pouvez faire avec F-BANKY
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              Gestion des comptes
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Consulter soldes et transactions</li>
              <li>Ouvrir un compte épargne</li>
              <li>Modifier ses informations personnelles</li>
            </ul>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              Transactions & Paiements
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Virements internes et externes</li>
              <li>Paiement de factures</li>
              <li>Ajout de bénéficiaires favoris</li>
            </ul>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              Services & Sécurité
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Demande de prêt et carte bancaire</li>
              <li>Authentification 2FA</li>
              <li>Support client intégré</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-6">
        <p>&copy; 2025 F-BANKY. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default HomePage;
