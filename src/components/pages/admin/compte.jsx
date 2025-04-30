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

const Compte = () => {
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
  const [compteData, setCompteData] = useState([]);

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

  const loadCompteData = () => {
    api.get(`/utilisateurs/compte`).then((rep) => {
      console.log(rep.data);
      setCompteData(rep.data);
    });
  };

  const resetData = () => {
    setPret({
      montant: 0,
      numCompte: "",
      duree: "",
      motif: "",
      revenu: 0,
    });
  };

  useEffect(() => {
    loadCompteData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPret({ ...pret, [name]: value });
  };

  const saveCompte = () => {
    // console.log(pret);
    api
      .post("/operations/pret", pret)
      .then((rep) => {
        // console.log(rep.data);
        loadCompteData();
        resetData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateCompte = () => {
    // console.log(pret);
    api
      .put("/operations/pret", pret)
      .then((rep) => {
        // console.log(rep.data);
        loadCompteData();
        resetData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteCompte = (numOp) => {
    swal({
      title: "Êtes-vous sûr ?",
      text: "Une fois supprimé, vous ne pourrez plus récupérer cet information !",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Oui",
          // className: "btn btn-success",
        },
        cancel: {
          text: "Non",
          visible: true,
          // className: "btn btn-danger",
        },
      },
    }).then((willDelete) => {
      if (willDelete) {
        api.delete(`operations/historique/${numOp}`).then((rep) => {
          if (rep.data.success) {
            swal(`${rep.data.message}`, {
              icon: "success",
              buttons: {
                confirm: {
                  className: "btn btn-success",
                },
              },
            });
            loadCompteData();
          } else {
            swal(`${rep.data.message}`, {
              icon: "error",
              buttons: {
                confirm: {
                  className: "btn btn-success",
                },
              },
            });
            loadCompteData();
          }
        });
      } else {
        swal.close();
      }
    });
  };

  const options = [
    { value: "En attente", label: "En attente" },
    { value: "Approuver", label: "Approuver" },
    { value: "Refuse", label: "Refuse" },
  ];

  return (
    <div className="container-data">
      <h2>Liste des comptes ouvertes</h2>

      {/* <form className="withdraw-form">
        <h2>Formulaire de demande de pret</h2>
        <input
          style={{ backgroundColor: "#fffcc8" }}
          type="text"
          placeholder="Nom"
          disabled
          value={user.nom + " " + user.prenom}
        />
        <input
          style={{ backgroundColor: "#fffcc8" }}
          type="text"
          placeholder="Numéro de compte"
          disabled
          name="numCompte"
          value={clientInfo.NumCompte}
        />
        <input
          type="number"
          name="montant"
          value={pret.montant}
          onChange={handleChange}
          placeholder="Montant du pret demande"
          min="0"
        />
        <input
          type="number"
          name="duree"
          value={pret.duree}
          onChange={handleChange}
          placeholder="Duree (en mois)"
        />
        <input
          type="number"
          name="revenu"
          value={pret.revenu}
          onChange={handleChange}
          placeholder="Revenu mensuel"
        />
        <textarea
          name="motif"
          value={pret.motif}
          onChange={handleChange}
          placeholder="Motif de la demande"
        ></textarea>

        <button
          type="button"
          onClick={() => {
            doPret();
          }}
          style={{
            fontSize: "20px",
          }}
        >
          <FontAwesomeIcon icon={faSave} />
        </button>
      </form> */}

      <div className="transaction-history">
        <div className="history-toolbar">
          <div styles={{ width: "100px" }}>
            <div className="action">
              <button>
                {" "}
                <FontAwesomeIcon icon={faPlus} /> &nbsp;&nbsp;Nouveau compte
              </button>
            </div>
            {/* <Select
              styles={{
                control: (base) => ({
                  ...base,
                  width: 250,
                }),
              }}
              options={options}
            /> */}
          </div>

          {/* <div className="actions">
            <button>
              <FontAwesomeIcon icon={faFilePdf} />
            </button>
            <button>
              <FontAwesomeIcon icon={faFileExcel} />
            </button>
            <button>
              <FontAwesomeIcon icon={faPrint} />
            </button>
          </div> */}
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>NUMERO COMPTE</th>
              <th>SOLDE</th>
              <th>DATE OUVERTURE</th>
              <th>TYPE</th>
              {/* <th>CLIENT</th> */}
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {compteData && compteData.length > 0 ? (
              compteData.map((item) => (
                <tr
                  data-tooltip-content={`Client : ${
                    item.Client.Nom + " " + item.Client.Prenom
                  }`}
                  data-tooltip-id="numCompte"
                  key={item.IdUt}
                >
                  <td>{item.NumCompte}</td>
                  <td>
                    {item.Solde.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    Ar
                  </td>
                  <td>{item.DateOuverture}</td>
                  <td>{item.Discriminator}</td>
                  <td>{item.StatusCompte}</td>
                  <td
                    style={{
                      color: "red",
                      fontSize: "20px",
                      // textAlign: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      // onClick={() => updateClient(item.NumOp)}
                      icon={faEdit}
                    />
                    &nbsp;&nbsp;&nbsp;
                    <FontAwesomeIcon
                      // onClick={() => deleteClient(item.NumOp)}
                      icon={faTrash}
                    />
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

export default Compte;
