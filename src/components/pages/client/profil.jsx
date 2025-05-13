import React, { use, useEffect, useState } from "react";
import "../../../assets/css/profil.css";
import api from "../../api/api";

const Profil = () => {
  const [user, setUser] = useState({});
  const [clientInfo, setClientInfo] = useState({});
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

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

  const changePassword = () => {
    // console.log(user.email, oldPass, newPass);
    api
      .put("/utilisateurs/utilisateur", {
        email: user.email,
        newPass: newPass,
      })
      .then((rep) => {
        if (rep.data.success) {
          console.log(rep.data.message);
        }
        console.log(rep.data.message);
        setOldPass("");
        setNewPass("");
      })
      .catch((err) => {
        console.log("Erreur lors du changement de mot de passe: ", err);
      });
  };

  const deleteAccount = () => {
    api
      .delete(`/utilisateurs/utilisateur/${user.email}`)
      .then((rep) => {
        console.log("Compte supprimé avec succès");
      })
      .catch((err) => {
        console.log("Erreur lors de la suppression du compte: ", err);
      });
  };

  return (
    <div className="container-profil">
      <h2>Profil et Sécurité</h2>
      <section>
        <h3>Informations du Profil</h3>
        <div className="row-profil">
          <div className="col-profil">
            <label>Nom complet</label>
            <input type="text" disabled value={user.nom + " " + user.prenom} />
          </div>
          <div className="col-profil">
            <label>Email</label>
            <input type="email" value={user.email} />
          </div>
          <div className="col-profil">
            <label>Téléphone</label>
            <input type="text" disabled value={user.contact} />
          </div>
          <div className="col-profil">
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
        <input
          type="password"
          placeholder="Ancien mot de passe"
          name="oldPass"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
        />
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          name="newPass"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <button onClick={changePassword} className="btn">
          Mettre à jour
        </button>
      </section>
      <section>
        <h3>Sécurité</h3>
        <p>
          <strong>2FA :</strong> <button className="btn">Activer</button>
        </p>
        <p>
          <strong>Dernière connexion :</strong> 21 avril 2025 à 12h45 depuis IP
          192.168.1.12
        </p>
      </section>
      <section className="danger-zone">
        <h3>Zone sensible</h3>
        <button className="btn btn-danger">Supprimer mon compte</button>
      </section>
    </div>
  );
};

export default Profil;
