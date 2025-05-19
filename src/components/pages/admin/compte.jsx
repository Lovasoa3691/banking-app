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
  faEyeSlash,
  faEye,
  faTimes,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { Tooltip } from "react-tooltip";
import DataTable from "react-data-table-component";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const Compte = () => {
  const [user, setUser] = useState({});
  const [compte, setcompte] = useState({
    idClient: "",
    solde: 0,
    numCompte: "",
    type: "",
    decouverte: "",
    taux: "",
  });

  const [compteData, setCompteData] = useState([]);

  const [numeroCompte, setNumeroCompte] = useState("");
  const [userData, setUserData] = useState([]);

  const [isActive, setIsActive] = useState(false);
  const [isEditActive, setIsEditActive] = useState(false);

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

  const verifierEtGenererNumeroUnique = async () => {
    let tentative = 0;
    let numero;
    let existe = true;

    while (existe && tentative < 10) {
      numero = genererNumeroCompte();
      const response = await api.post("operations/check", {
        numCompte: numero.replace(/ /g, ""),
      });

      existe = response.data.exists;
      tentative++;
    }

    return numero;
  };

  useEffect(() => {
    const initialiser = async () => {
      const numeroUnique = await verifierEtGenererNumeroUnique();
      setNumeroCompte(numeroUnique);
    };
    initialiser();
  }, []);

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

  const customStyles = {
    rows: {
      style: {
        minHeight: "60px",
        fontSize: "15px",
        borderBottom: "1px solid #eee",
      },
    },
    headCells: {
      style: {
        backgroundColor: "#009879",
        color: "white",
        fontSize: "15px",
        fontWeight: "600",
        textTransform: "uppercase",
      },
    },
    cells: {
      style: {
        padding: "12px",
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #eee",
        padding: "10px",
        fontSize: "15px",
        // justifyContent: "center",
      },
    },
  };

  const columns = [
    {
      name: "Numero compte",
      selector: (row) => (
        <div
          data-tooltip-content={`Client : ${
            row.Client.Nom +
            " " +
            row.Client.Prenom +
            " (" +
            row.Client.Telephone +
            ") "
          }`}
          data-tooltip-id="numCompte"
        >
          {row.NumCompte.replace(/(.{4})/g, "$1 ").trim()}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Date d'ouverture",
      selector: (row) => row.DateOuverture.split("T")[0],
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.Discriminator,
      sortable: true,
    },
    {
      name: "Solde",
      selector: (row) =>
        `${row.Solde.toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} Ar`,
      sortable: true,
      // right: true,
    },
    {
      name: "Decouverte",
      selector: (row) =>
        `${row.Decouvert.toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} Ar`,
      sortable: true,
    },
    {
      name: "Taux",
      selector: (row) => row.Taux,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <div
        // style={{
        //   padding: "5px",
        //   width: "70px",
        //   backgroundColor: "green",
        //   borderRadius: "5px",
        //   color: "white",
        // }}
        >
          {row.StatusCompte}
        </div>
      ),
      sortable: true,
    },

    {
      name: "Actions",
      cell: (row) => (
        <div
          style={{
            color: "red",
            fontSize: "20px",
          }}
        >
          <FontAwesomeIcon
            style={{ color: "black" }}
            onClick={() => openEditModal(row)}
            icon={faEdit}
          />
          &nbsp;&nbsp;&nbsp;
          <FontAwesomeIcon
            onClick={() => deleteCompte(row.NumCompte)}
            icon={faTrash}
          />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      // button: true,
    },
  ];

  const paginationData = {
    rowsPerPageText: "Lignes par page",
    rangeSeparatorText: "sur",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Tous",
  };

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
      decouverte: "",
      taux: "",
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

  const openModal = () => {
    if (userData.length === 0) {
      swal(
        "Aucun client disponible",
        "Aucun client n’a été récemment enregistré pour l’association d’un compte.",
        {
          icon: "warning",
          buttons: {
            confirm: {
              text: "OK",
              className: "btn btn-warning",
            },
          },
        }
      );
      return;
    }

    setIsActive(true);
  };

  // useEffect(() => {
  //   compte.numCompte = genererNumeroCompte();
  //   compte.idClient = userData.IdUt;
  // }, [numeroCompte, userData]);

  useEffect(() => {
    if (numeroCompte && userData?.IdUt) {
      setcompte((prev) => ({
        ...prev,
        numCompte: numeroCompte.replace(/ /g, ""), // En version sans espaces
        idClient: userData.IdUt,
      }));
    }
  }, [numeroCompte, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setcompte({ ...compte, [name]: value });
  };

  useEffect(() => {
    if (compte.type === "Epargne") {
      compte.decouverte = 0;
      compte.taux = 0.15;
    } else if (compte.type === "Courant") {
      compte.decouverte = 3000;
      compte.taux = 0;
    } else {
      (compte.decouverte = 0), (compte.taux = 0);
    }
  }, [compte]);

  const saveCompte = () => {
    const dataToSend = {
      ...compte,
      numCompte: compte.numCompte.replace(/\s/g, ""),
    };
    api
      .post("/operations/compte", dataToSend)
      .then((rep) => {
        if (rep.data.success) {
          swal(
            `${rep.data.message} \n\n Votre code PIN est ${rep.data.codePin}`,
            {
              icon: "success",
              buttons: {
                confirm: {
                  className: "btn btn-success",
                },
              },
            }
          );
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

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompte = compteData.filter((compte) =>
    (
      compte.NumCompte +
      " " +
      compte.DateOuverture +
      " " +
      compte.Solde +
      " " +
      compte.Discriminator +
      " " +
      compte.Decouvert +
      " " +
      compte.Taux
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    return date.split("T")[0];
  };

  const ExporterExcel = () => {
    if (compteData.length > 0) {
      const donnees = compteData.map((compte) => ({
        "Numéro de compte": compte.NumCompte,
        Solde: compte.Solde,
        Type: compte.Discriminator,
        Découvert: compte.Decouvert || "N/A",
        Taux: compte.Taux || "N/A",
      }));

      const ws = XLSX.utils.json_to_sheet(donnees);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Comptes");
      XLSX.writeFile(wb, "liste_comptes.xlsx");
    } else {
      swal("Désolé ! Aucun donnée à exporter", {
        icon: "error",
        buttons: {
          confirm: {
            className: "btn btn-success",
          },
        },
      });
    }
  };

  const ExporterPDF = () => {
    const doc = new jsPDF();
    const colonnes = ["NUM COMPTE", "SOLDE", "TYPE", "DECOUVERTE", "TAUX"];
    const ligne = compteData.map((ligne) => [
      ligne.NumCompte.replace(/(.{4})/g, "$1 ").trim(),
      ligne.Solde.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      ligne.Discriminator,
      ligne.Decouvert.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      ligne.Taux,
    ]);

    if (compteData.length > 0) {
      doc.text(`Liste des comptes existants`, 15, 10);
      doc.autoTable({
        head: [colonnes],
        body: ligne,
        startY: 20,
      });

      doc.save(`liste_compte.pdf`);
    } else {
      swal(`Desole! Aucun donnee a exporter`, {
        icon: "error",
        buttons: {
          confirm: {
            className: "btn btn-success",
          },
        },
      });
    }
  };

  return (
    <div className="container-data">
      <h2 style={{ textAlign: "start" }}>Liste des comptes ouverts</h2>

      {isActive && (
        <div className="modal-overlay">
          <div className="modal">
            <form className="">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2>Nouveau compte bancaire</h2>
                <FontAwesomeIcon
                  onClick={() => setIsActive(false)}
                  size="2x"
                  style={{ color: "red" }}
                  icon={faTimes}
                />
              </div>
              <br />
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
                  onChange={handleChange}
                >
                  {userData && (
                    <option value={userData.IdUt}>
                      {userData.Nom + " " + userData.Prenom}
                    </option>
                  )}
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
                  type="text"
                  name="decouverte"
                  disabled
                  id="decouverte"
                  value={compte.decouverte}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="numCompte">Taux</label>
                <input
                  type="text"
                  name="taux"
                  disabled
                  id="taux"
                  value={compte.taux}
                  onChange={handleChange}
                />
              </div>

              <div className="btn-save">
                <button onClick={saveCompte} type="button">
                  <FontAwesomeIcon icon={faSave} /> &nbsp;&nbsp; Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditActive && (
        <div className="modal-overlay">
          <div className="modal">
            <form className="">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2>Modification</h2>
                <FontAwesomeIcon
                  onClick={() => setIsEditActive(false)}
                  size="2x"
                  style={{ color: "red" }}
                  icon={faTimes}
                />
              </div>
              <br />
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
                  disabled
                  style={{ width: "100%", padding: "10px" }}
                  id="taux"
                  value={compte.taux}
                  onChange={handleChange}
                >
                  <option value="0.15">15%</option>
                </select>
              </div>
              <div className="btn-save">
                <button onClick={updateCompte} type="button">
                  <FontAwesomeIcon icon={faSave} /> &nbsp;&nbsp; Mettre a jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="transaction-history">
        <div className="history-toolbar">
          <div styles={{ width: "100px" }}>
            <div>
              <button
                style={{
                  backgroundColor: "#182f90",
                  color: "white",
                }}
                onClick={openModal}
              >
                {" "}
                <FontAwesomeIcon icon={faPlus} />
                &nbsp;&nbsp; Nouveau compte
              </button>
            </div>
          </div>

          <div className="actions" style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={ExporterPDF}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                backgroundColor: "transparent",
                border: "1px ridge green",
              }}
            >
              <FontAwesomeIcon style={{ color: "red" }} icon={faFilePdf} />
              Exporter PDF
            </button>
            <button
              onClick={ExporterExcel}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                backgroundColor: "transparent",
                border: "1px ridge green",
              }}
            >
              <FontAwesomeIcon style={{ color: "green" }} icon={faFileExcel} />
              Exporter Excel
            </button>
          </div>
        </div>

        {/* <table className="custom-table">
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
            {filteredClients && filteredClients.length > 0 ? (
              filteredClients.map((item) => (
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
                  <td>{formatDate(item.DateOuverture)}</td>
                  <td>{item.NumCompte.replace(/(.{4})/g, "$1 ").trim()}</td>
                  <td>
                    {item.Solde.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    Ar
                  </td>

                  <td>{item.Discriminator}</td>
                  <td>
                    {item.Discriminator == "Epargne"
                      ? "Null"
                      : item.Decouvert.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                  </td>
                  <td>{item.Taux}</td>
                  <td>{item.StatusCompte}</td>
                  <td
                    style={{
                      color: "red",
                      fontSize: "20px",
                     
                    }}
                  >
                   
                    &nbsp;&nbsp;&nbsp;
                    <FontAwesomeIcon
                      style={{ color: "black" }}
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
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: "center",
                    fontStyle: "italic",
                    padding: "20px",
                  }}
                >
                  Aucune donnée trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table> */}

        <div style={{ maxWidth: "100%", overflowX: "auto" }}>
          <DataTable
            columns={columns}
            data={filteredCompte}
            pagination
            responsive
            highlightOnHover
            customStyles={customStyles}
            noDataComponent="Aucune donnée trouvée."
            paginationComponentOptions={paginationData}
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="🔍 Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  width: "300px",
                }}
              />
            }
          />
        </div>

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
