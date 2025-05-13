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
  const [compte, setcompte] = useState({
    idClient: "",
    solde: 0,
    numCompte: "",
    type: "",
    decouverte: 0,
    taux: 0,
  });

  const [numCompte, setNumCompte] = useState("");
  const [compteData, setCompteData] = useState([]);

  const [numeroCompte, setNumeroCompte] = useState("");
  const [userData, setUserData] = useState({});

  const [isActive, setIsActive] = useState(false);
  const [isEditActive, setIsEditActive] = useState(false);

  const openModal = () => {
    setIsActive(true);
  };

  const openEditModal = (item) => {
    setIsEditActive(true);

    compte.numCompte = item.NumCompte;
    compte.type = item.Discriminator;
    compte.decouverte = item.Decouvert;
    compte.taux = item.Taux;
    compte.idClient = item.Client.IdUt;
    compte.solde = item.Solde;
  };

  const genererNumeroCompte = () => {
    let numero = "";
    for (let i = 0; i < 16; i++) {
      const chiffre = Math.floor(Math.random() * 10);
      if (i === 0 && chiffre === 0) {
        i--;
        continue;
      }
      numero += chiffre.toString();
    }

    return numero.match(/.{1,4}/g).join(" ");
  };

  useEffect(() => {
    setNumeroCompte(genererNumeroCompte());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const numeroSansEspaces = numeroCompte.replace(/\s/g, "");
    // console.log("Numéro de compte (brut) :", numeroSansEspaces);
  };

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

  const loadCompteData = () => {
    api.get(`/utilisateurs/compte`).then((rep) => {
      setCompteData(rep.data);
    });
  };

  const resetData = () => {
    setcompte({
      idClient: "",
      solde: 0,
      numCompte: "",
      type: "",
      decouverte: 0,
      taux: 0,
    });
  };

  useEffect(() => {
    loadCompteData();
  }, []);

  const loadUserData = () => {
    api
      .get("utilisateurs/all")
      .then((rep) => {
        setUserData(rep.data);
      })
      .catch((err) => {
        console.log("Utilisateur non trouve: ", err);
      });
  };

  useEffect(() => {
    loadUserData();
  }, [userData]);

  useEffect(() => {
    compte.numCompte = genererNumeroCompte();
    compte.idClient = userData.IdUt;
  }, [numeroCompte, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setcompte({ ...compte, [name]: value });
  };

  const saveCompte = () => {
    // console.log(compte);
    api
      .post("/operations/compte", compte)
      .then((rep) => {
        if (rep.data.success) {
          swal(`${rep.data.message}`, {
            icon: "success",
            buttons: {
              confirm: {
                className: "btn btn-success",
              },
            },
          });
        } else {
          swal(`${rep.data.message}`, {
            icon: "error",
            buttons: {
              confirm: {
                className: "btn btn-success",
              },
            },
          });
        }
        setIsActive(false);
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
      .put(`/operations/compte/${compte.numCompte}`, compte)
      .then((rep) => {
        if (rep.data.success) {
          swal(`${rep.data.message}`, {
            icon: "success",
            buttons: {
              confirm: {
                className: "btn btn-success",
              },
            },
          });
        } else {
          swal(`${rep.data.message}`, {
            icon: "error",
            buttons: {
              confirm: {
                className: "btn btn-success",
              },
            },
          });
        }
        setIsEditActive(false);
        loadCompteData();
        resetData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteCompte = (num) => {
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
        api.delete(`operations/compte/${num}`).then((rep) => {
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

  return (
    <div className="container-data">
      <h2 style={{ textAlign: "start" }}>Liste des comptes ouvertes</h2>

      {isActive && (
        <div className="modal">
          <form className="">
            <h2>Enregistrement d'un nouveau compte bancaire</h2>
            <div className="form-group">
              <label htmlFor="numCompte">Numéro de compte</label>
              <input
                type="text"
                name="numCompte"
                disabled
                id="numCompte"
                value={numeroCompte}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ paddingBottom: "25px" }}>
              <label htmlFor="numCompte">Type de compte</label>
              <select
                name="type"
                style={{ width: "100%", padding: "10px" }}
                id=""
                value={compte.type}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Chosir le type de compte
                </option>
                <option value="Courant">Courant</option>
                <option value="Epargne">Epargne</option>
              </select>
            </div>
            <div className="form-group" style={{ paddingBottom: "25px" }}>
              <label htmlFor="numCompte">Nom et prenom du client</label>
              <select
                name="idClient"
                style={{ width: "100%", padding: "10px" }}
                id=""
                value={compte.idClient}
                onChange={handleChange}
              >
                <option value={userData.IdUt}>
                  {userData.Nom + " " + userData.Prenom}
                </option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="numCompte">Solde du compte</label>
              <input
                type="number"
                name="solde"
                id="solde"
                value={compte.solde}
                onChange={handleChange}
                min={0}
              />
            </div>
            <div className="form-group">
              <label htmlFor="numCompte">Montant du decouverte</label>
              <input
                type="number"
                name="decouverte"
                id="decouverte"
                value={compte.decouverte}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ paddingBottom: "25px" }}>
              <label htmlFor="numCompte">Taux</label>
              <select
                name="taux"
                style={{ width: "100%", padding: "10px" }}
                id="taux"
                value={compte.taux}
                onChange={handleChange}
              >
                <option selected defaultValue={""}>
                  Choisir
                </option>
                <option value="0.05">5%</option>
                <option value="0.10">10%</option>
                <option value="0.15">15%</option>
                <option value="0.20">20%</option>
              </select>
            </div>
            <div className="btn-save">
              <button onClick={saveCompte} type="button">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {isEditActive && (
        <div className="modal">
          <form className="">
            <h2>Modification</h2>
            <div className="form-group">
              <label htmlFor="numCompte">Numéro de compte</label>
              <input
                type="text"
                name="numCompte"
                disabled
                id="numCompte"
                value={compte.numCompte}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ paddingBottom: "25px" }}>
              <label htmlFor="numCompte">Type de compte</label>
              <select
                disabled
                name="type"
                style={{ width: "100%", padding: "10px" }}
                id=""
                value={compte.type}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Chosir le type de compte
                </option>
                <option value="Courant">Courant</option>
                <option value="Epargne">Epargne</option>
              </select>
            </div>
            <div className="form-group" style={{ paddingBottom: "25px" }}>
              <label htmlFor="numCompte">Nom et prenom du client</label>
              <select
                name="idClient"
                style={{ width: "100%", padding: "10px" }}
                id=""
                value={compte.idClient}
                onChange={handleChange}
              >
                <option value={userData.IdUt}>
                  {userData.Nom + " " + userData.Prenom}
                </option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="numCompte">Solde du compte</label>
              <input
                type="number"
                name="solde"
                id="solde"
                value={compte.solde}
                onChange={handleChange}
                min={0}
              />
            </div>
            <div className="form-group">
              <label htmlFor="numCompte">Montant du decouverte</label>
              {compte.type == "Epargne" ? (
                <input
                  type="number"
                  name="decouverte"
                  id="decouverte"
                  disabled
                  value={compte.decouverte}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type="number"
                  name="decouverte"
                  id="decouverte"
                  value={compte.decouverte}
                  onChange={handleChange}
                />
              )}
            </div>
            <div className="form-group" style={{ paddingBottom: "25px" }}>
              <label htmlFor="numCompte">Taux</label>
              <select
                name="taux"
                style={{ width: "100%", padding: "10px" }}
                id="taux"
                value={compte.taux}
                onChange={handleChange}
              >
                <option defaultValue={""}>Choisir</option>
                <option value="0.05">5%</option>
                <option value="0.10">10%</option>
                <option value="0.15">15%</option>
                <option value="0.20">20%</option>
              </select>
            </div>
            <div className="btn-save">
              <button onClick={updateCompte} type="button">
                Mettre a jour
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="transaction-history">
        <div className="history-toolbar">
          <div styles={{ width: "100px" }}>
            <div className="action">
              <button onClick={openModal}>
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
              <th>DATE OUVERTURE</th>
              <th>NUMERO COMPTE</th>
              <th>SOLDE</th>

              <th>TYPE</th>
              <th>DECOUVERTE</th>
              <th>TAUX</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {compteData && compteData.length > 0 ? (
              compteData.map((item) => (
                <tr
                  data-tooltip-content={`Client : ${
                    item.Client.Nom +
                    " " +
                    item.Client.Prenom +
                    " (" +
                    item.Client.Telephone +
                    ") "
                  }`}
                  data-tooltip-id="numCompte"
                  key={item.NumCompte}
                >
                  <td>{item.DateOuverture}</td>
                  <td>{item.NumCompte}</td>
                  <td>
                    {item.Solde.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    Ar
                  </td>

                  <td>{item.Discriminator}</td>
                  <td>
                    {item.Discriminator == "Epargne" ? "Null" : item.Decouvert}
                  </td>
                  <td>{item.Taux}</td>
                  <td>{item.StatusCompte}</td>
                  <td
                    style={{
                      color: "red",
                      fontSize: "20px",
                      // textAlign: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      onClick={() => openEditModal(item)}
                      icon={faEdit}
                    />
                    &nbsp;&nbsp;&nbsp;
                    <FontAwesomeIcon
                      onClick={() => deleteCompte(item.NumCompte)}
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
