import React, { useEffect, useState } from "react";
import "../../../assets/css/profil.css";
import api from "../../api/api";

const Profil = () => {
  const [user, setUser] = useState({});
  const [clientInfo, setClientInfo] = useState({});

  const [numCompte, setNumCompte] = useState("");

  useEffect(() => {
    api
      .get("/utilisateurs/me")
      .then((rep) => {
        setUser(rep.data.user);
      })
      .catch((err) => {
        console.log("Uitlisateur non connecte: ", err);
      });
  }, []);

  const loadVirementData = () => {
    api.get(`/operations/virement/${numCompte}`).then((rep) => {
      // setVirementData(rep.data);
    });
  };

  return (
    <div class="container-profil">
      <h2>Profil et Sécurité</h2>
      <section>
        <h3>Informations du Profil</h3>
        <div class="row-profil">
          <div class="col-profil">
            <label>Nom complet</label>
            <input type="text" disabled value={user.nom + " " + user.prenom} />
          </div>
          <div class="col-profil">
            <label>Email</label>
            <input type="email" disabled value={user.email} />
          </div>
          <div class="col-profil">
            <label>Téléphone</label>
            <input type="text" disabled value={user.contact} />
          </div>
          <div class="col-profil">
            <label>Rôle</label>
            <input
              type="text"
              value={user.role === "Client" ? "Utilisateur" : "Administrateur"}
              disabled
            />
          </div>
        </div>
      </section>
      <section>
        <h3>Changer le mot de passe</h3>
        <input type="password" placeholder="Ancien mot de passe" />
        <input type="password" placeholder="Nouveau mot de passe" />
        <button class="btn">Mettre à jour</button>
      </section>
      <section>
        <h3>Sécurité</h3>
        <p>
          <strong>2FA :</strong> <button class="btn">Activer</button>
        </p>
        <p>
          <strong>Dernière connexion :</strong> 21 avril 2025 à 12h45 depuis IP
          192.168.1.12
        </p>
      </section>
      <section class="danger-zone">
        <h3>Zone sensible</h3>
        <button class="btn btn-danger">Supprimer mon compte</button>
      </section>
    </div>
  );
};

export default Profil;
