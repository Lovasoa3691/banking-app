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
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { Tooltip } from "react-tooltip";
import DataTable from "react-data-table-component";

const Pret = () => {
  const [user, setUser] = useState({});
  const [clientInfo, setClientInfo] = useState({});
  const [pret, setPret] = useState({
    montant: "",
    numCompte: "",
    duree: "",
    motif: "",
    revenu: "",
  });

  const [numCompte, setNumCompte] = useState("");
  const [pretData, setPretData] = useState([]);

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
      selector: (row) => row.NumCompte,
      sortable: true,
    },
    {
      name: "Date d'envoie",
      selector: (row) => formatDate(row.DateOp),
      sortable: true,
    },
    {
      name: "Motif",
      selector: (row) => row.Motif,
      sortable: true,
    },
    {
      name: "Montant demande",
      selector: (row) =>
        `${row.Montant.toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} Ar`,
      sortable: true,
      // right: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <div
          style={{
            padding: "4px",
            width: "70px",
            borderStyle: "none",
            borderRadius: "7px",
            color: "white",
            backgroundColor:
              row.StatusP === "Accepte"
                ? "green"
                : row.StatusP === "Refuse"
                ? "red"
                : "black",
            fontWeight: "bold",
          }}
        >
          {row.StatusP}
        </div>
      ),
      sortable: true,
    },

    {
      name: "Actions",
      cell: (row) => (
        <select
          style={{
            padding: "10px",
            fontSize: "17px",
            borderRadius: "5px",
            width: "100%",
            backgroundColor: "#fffcc8",
            border: "1px solid #ccc",
          }}
          onChange={(e) => updatePret(row.NumOp, e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Choisir
          </option>
          <option
            value="Accepte"
            disabled={row.StatusP === "Accepte" || row.StatusP === "Refuse"}
          >
            <FontAwesomeIcon icon={faCheck} />
            Accepter
          </option>
          <option
            value="Refuse"
            disabled={row.StatusP === "Accepte" || row.StatusP === "Refuse"}
          >
            <FontAwesomeIcon icon={faTimes} />
            Refuser
          </option>
          <option value="Supprimer">
            <FontAwesomeIcon icon={faTrash} />
            Supprimer
          </option>
        </select>
      ),
      // ignoreRowClick: true,
      // allowOverflow: true,
      // button: true,
    },
  ];

  const paginationData = {
    rowsPerPageText: "Lignes par page",
    rangeSeparatorText: "sur",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Tous",
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

  const deleteHistorique = (numOp) => {
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
            loadPretData();
          } else {
            swal(`${rep.data.message}`, {
              icon: "error",
              buttons: {
                confirm: {
                  className: "btn btn-success",
                },
              },
            });
            loadPretData();
          }
        });
      } else {
        swal.close();
      }
    });
  };

  const updatePret = (id, state) => {
    if (state === "Supprimer") {
      deleteHistorique(id);
    } else {
      api
        .put(`/operations/pret/${id}`, { status: state })
        .then((rep) => {
          swal({
            title: "Succes",
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
    }
  };

  const options = [
    { value: "En attente", label: "En attente" },
    { value: "Accepte", label: "Accepter" },
    { value: "Refuse", label: "Refuser" },
  ];

  const [selectedStatus, setSelectedStatus] = useState(null);

  const filteredPretData = selectedStatus
    ? pretData.filter((item) => item.StatusP === selectedStatus)
    : pretData;

  const formatDate = (date) => {
    return date.split("T")[0];
  };

  return (
    <div className="container-data">
      <h2 style={{ textAlign: "start" }}>Liste des demandes de prêt reçues</h2>

      <div className="transaction-history">
        <div className="history-toolbar">
          <div style={{ width: "250px", marginBottom: "15px" }}>
            <Select
              // styles={{
              //   control: (base) => ({
              //     ...base,
              //     width: 250,
              //   }),
              // }}
              options={options}
              placeholder="Filtrer par statut"
              onChange={(option) =>
                setSelectedStatus(option ? option.value : null)
              }
              isClearable
            />
          </div>
        </div>

        {/* <table className="custom-table">
          <thead>
            <tr>
              <th>NUMERO COMPTE</th>
              <th>DATE D'ENVOIE</th>
              <th>MOTIF</th>
              <th>MONTANT A DEMANDER</th>

              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredPretData && filteredPretData.length > 0 ? (
              filteredPretData.map((item) => (
                <tr key={item.NumOp}>
                  <td>{item.NumCompte.replace(/(.{4})/g, "$1 ").trim()}</td>
                  <td>{formatDate(item.DateOp)}</td>
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
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choisir
                      </option>
                      <option
                        value="Accepte"
                        disabled={
                          item.StatusP === "Accepte" ||
                          item.StatusP === "Refuse"
                        }
                      >
                        <FontAwesomeIcon icon={faCheck} />
                        Accepter
                      </option>
                      <option
                        value="Refuse"
                        disabled={
                          item.StatusP === "Accepte" ||
                          item.StatusP === "Refuse"
                        }
                      >
                        <FontAwesomeIcon icon={faTimes} />
                        Refuser
                      </option>
                      <option value="Supprimer">
                        <FontAwesomeIcon icon={faTrash} />
                        Supprimer
                      </option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
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
            data={filteredPretData}
            pagination
            responsive
            highlightOnHover
            customStyles={customStyles}
            noDataComponent="Aucune donnée trouvée."
            paginationComponentOptions={paginationData}
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

export default Pret;
