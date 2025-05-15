import axios from "axios";
import React, { useState, useEffect } from "react";
import api from "../../api/api";
import swal from "sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faTrash,
  faPrint,
  faFilePdf,
  faSave,
  faFileExcel,
  faEdit,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { Tooltip } from "react-tooltip";

const Pret = () => {
  const [user, setUser] = useState({});
  const [clientInfo, setClientInfo] = useState({});
  const [pret, setPret] = useState({
    montant: 0,
    numCompte: "",
    duree: "",
    motif: "",
    revenu: 0,
  });

  const [numCompte, setNumCompte] = useState("");
  const [pretData, setPretData] = useState([]);

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

  useEffect(() => {
    api
      .get(`/utilisateurs`)
      .then((rep) => {
        setClientInfo(rep.data.client);
        pret.numCompte = rep.data.client.NumCompte;
        setNumCompte(rep.data.client.NumCompte);
      })
      .catch((err) => {
        console.log("Compte non trouve: ", err);
      });
  }, []);

  const loadPretData = () => {
    api.get(`/operations/pret`).then((rep) => {
      // console.log(rep.data);
      setPretData(rep.data);
    });
  };

  useEffect(() => {
    loadPretData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPret({ ...pret, [name]: value });
  };

  const updatePret = (id, state) => {
    api
      .put(`/operations/pret/${id}`, { status: state })
      .then((rep) => {
        swal({
          title: "Success",
          text: rep.data.message || "Operation reussie",
          icon: "success",
          buttons: {
            confirm: {
              className: "btn btn-success",
            },
          },
        });
        loadPretData();
      })
      .catch((err) => {
        swal({
          title: "Erreur",
          text: err.response?.data?.message || "Une erreur s'est produite",
          icon: "error",
          buttons: {
            confirm: {
              className: "btn btn-danger",
            },
          },
        });
      });
  };

  const options = [
    { value: "En attente", label: "En attente" },
    { value: "Approuver", label: "Approuver" },
    { value: "Refuse", label: "Refuse" },
  ];

  return (
    <div className="container-data">
      <h2 style={{ textAlign: "start" }}>Liste des demandes de pret recus</h2>

      <div className="transaction-history">
        <div className="history-toolbar">
          <div styles={{ width: "100px" }}></div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>NUMERO COMPTE</th>
              <th>DATE D'ENVOIE</th>
              <th>MOTIF</th>
              <th>MONTANT A DEMANDER</th>
              {/* <th>CLIENT</th> */}
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {pretData && pretData.length > 0 ? (
              pretData.map((item) => (
                <tr
                  // data-tooltip-content={`Client : ${
                  //   item.Client.Nom + " " + item.Client.Prenom
                  // }`}
                  // data-tooltip-id="numCompte"
                  key={item.NumOp}
                >
                  <td>{item.NumCompte}</td>
                  <td>{item.DateOp}</td>
                  <td>{item.Motif}</td>
                  <td>
                    {item.Montant.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    Ar
                  </td>
                  <td>{item.StatusP}</td>
                  <td>
                    <select
                      style={{
                        padding: "10px",
                        fontSize: "17px",
                        borderRadius: "5px",
                        width: "100%",
                        backgroundColor: "#fffcc8",
                        border: "1px solid #ccc",
                      }}
                      onChange={(e) => updatePret(item.NumOp, e.target.value)}
                    >
                      <option defaultValue={"Choisir"} disabled selected>
                        Choisir
                      </option>
                      <option value="Accepte">Accepter</option>
                      <option value="Refuse">Refuser</option>
                      <option value="Supprimer">Supprimer</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr></tr>
            )}
          </tbody>
        </table>

        <Tooltip
          id="numCompte"
          place="end"
          style={{
            backgroundColor: "#222",
            color: "#fff",
            fontSize: "14px",
            borderRadius: "6px",
            padding: "8px 12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
          delayShow={200}
          offset={10}
        />
      </div>
    </div>
  );
};

export default Pret;
