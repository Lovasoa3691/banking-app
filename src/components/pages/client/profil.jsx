import React, { use, useEffect, useState } from "react";
import "../../../assets/css/profil.css";
import api from "../../api/api";
import Swal from "sweetalert2";

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
    swal({
      title: "Confirmer la modification",
      text: "Es-tu sûr de vouloir changer ton mot de passe ?",
      icon: "warning",
      buttons: ["Annuler", "Oui, confirmer"],
      dangerMode: true,
    }).then((willChange) => {
      if (willChange) {
        api
          .put("/utilisateurs/utilisateur", {
            email: user.email,
            newPass: newPass,
          })
          .then((rep) => {
            if (rep.data.success) {
              swal({
                title: "Mot de passe changé avec succès",
                icon: "success",
                button: "OK",
              });
            } else {
              swal({
                title: "Erreur",
                text: rep.data.message,
                icon: "error",
                button: "OK",
              });
            }
            setOldPass("");
            setNewPass("");
          })
          .catch((err) => {
            console.log("Erreur lors du changement de mot de passe: ", err);
            swal({
              title: "Erreur serveur",
              text: "Une erreur est survenue, réessaie plus tard.",
              icon: "error",
              button: "OK",
            });
          });
      }
    });
  };

  const deleteAccount = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible. Votre compte sera définitivement supprimé.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`/utilisateurs/utilisateur/${user.email}`)
          .then(() => {
            if (rep.data.success) {
              Swal.fire(
                "Supprimé !",
                "Votre compte a été supprimé avec succès.",
                "success"
              );
              localStorage.removeItem("token");
              navigate("/login");
            }
          })
          .catch((err) => {
            console.log("Erreur lors de la suppression du compte: ", err);
            Swal.fire(
              "Erreur",
              "Une erreur s’est produite lors de la suppression du compte.",
              "error"
            );
          });
      }
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
      {/* <section>
        <h3>Sécurité</h3>
        <p>
          <strong>2FA :</strong> <button className="btn">Activer</button>
        </p>
        <p>
          <strong>Dernière connexion :</strong> 21 avril 2025 à 12h45 depuis IP
          192.168.1.12
        </p>
      </section> */}
      <section className="danger-zone">
        <h3>Zone sensible</h3>
        <button className="btn btn-danger" onClick={deleteAccount}>
          Supprimer mon compte
        </button>
      </section>
    </div>
  );
};

export default Profil;
