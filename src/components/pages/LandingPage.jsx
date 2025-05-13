import React from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/landing.css";
import banque from "../../assets/images/1678475326526.png";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill,
  faCreditCard,
  faChartLine,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <h1 className="logo">F-BANKY</h1>
        <div className="nav-buttons">
          <button onClick={() => navigate("/register")}>S'inscrire</button>
          <button onClick={() => navigate("/login")} className="outline">
            Se connecter
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h2>Une nouvelle façon de gérer votre argent</h2>
            <p>
              F-BANKY vous offre une plateforme bancaire moderne, rapide et
              sécurisée. Accédez à vos comptes, effectuez des virements, suivez
              vos transactions, le tout en quelques clics.
            </p>
          </div>
          <div className="hero-image">
            <img src={banque} alt="Banque moderne" />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services-section">
        {[
          {
            icon: <FontAwesomeIcon icon={faCreditCard} />,
            title: "Comptes Bancaires",
            desc: "Gérez vos comptes courants et épargnes en ligne, à tout moment.",
          },
          {
            icon: <FontAwesomeIcon icon={faMoneyBill} />,
            title: "Paiements & Virements",
            desc: "Effectuez des paiements sécurisés et rapides, locaux ou internationaux.",
          },
          {
            icon: <FontAwesomeIcon icon={faHeadset} />,
            title: "Support Client 24/7",
            desc: "Une assistance humaine, disponible en permanence pour vous accompagner.",
          },
        ].map((item, index) => (
          <div
            className="card"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "40px",
            }}
            key={index}
          >
            <div className="icon" style={{ fontSize: "50px" }}>
              {item.icon}
            </div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Sécurité */}
      <section className="security-section">
        <h2>Sécurité de vos données</h2>
        <p>
          Chez F-BANKY, la sécurité est notre priorité. Nous utilisons un
          chiffrement de niveau bancaire, une authentification multi-facteurs
          (MFA), et une surveillance en temps réel des activités suspectes.
        </p>
      </section>

      {/* Valeurs */}
      <section className="values-section">
        <h2>Nos valeurs</h2>
        <p>
          F-BANKY est fondée sur la transparence, la confiance et l’innovation.
        </p>
        <div className="values-tags">
          <span>Fiabilité</span>
          <span>Innovation</span>
          <span>Accessibilité</span>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="features-section">
        <h2>Ce que vous pouvez faire avec F-BANKY</h2>
        <div className="features-grid">
          {[
            {
              title: "Gestion des comptes",
              items: [
                "Consulter soldes et transactions",
                "Ouvrir un compte épargne",
                "Modifier ses informations personnelles",
              ],
            },
            {
              title: "Transactions & Paiements",
              items: [
                "Virements internes et externes",
                "Paiement de factures",
                "Ajout de bénéficiaires favoris",
              ],
            },
            {
              title: "Services & Sécurité",
              items: [
                "Demande de prêt et carte bancaire",
                "Authentification 2FA",
                "Support client intégré",
              ],
            },
          ].map((block, index) => (
            <div className="feature-card" key={index}>
              <h3>{block.title}</h3>
              <ul>
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        &copy; 2025 F-BANKY. Tous droits réservés.
      </footer>
    </div>
  );
};

export default LandingPage;
