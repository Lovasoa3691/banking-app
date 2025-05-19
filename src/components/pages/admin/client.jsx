import axios from "axios";
import { useState, useEffect } from "react";
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
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import DataTable from "react-data-table-component";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const Client = () => {
  const [user, setUser] = useState({});
  const [clientInfo, setClientInfo] = useState({});
  const [data, setData] = useState({
    id: "",
    nom: "",
    cin: "",
    prenom: "",
    adresse: "",
    telephone: "+261",
    profession: "",
  });

  const [numCompte, setNumCompte] = useState("");
  const [clientData, setClientData] = useState([]);

  const [isActive, setIsActive] = useState(false);
  const [isEditActive, setIsEditActive] = useState(false);

  const openModal = () => {
    setIsActive(true);
  };

  const openEditModal = (item) => {
    setIsEditActive(true);

    data.id = item.IdUt;
    data.nom = item.Nom;
    data.cin = item.Cin;
    data.prenom = item.Prenom;
    data.adresse = item.Adresse;
    data.telephone = item.Telephone;
    data.profession = item.Profession;
  };

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
      name: "Cin",
      selector: (row) => row.Cin,
      sortable: true,
    },
    {
      name: "Nom",
      selector: (row) => row.Nom,
      sortable: true,
    },
    {
      name: "Prenom",
      selector: (row) => row.Prenom,
      sortable: true,
    },
    {
      name: "Adresse",
      selector: (row) => row.Adresse,
      sortable: true,
    },
    {
      name: "Telephone",
      selector: (row) => row.Telephone,
      sortable: true,
    },
    {
      name: "Profession",
      selector: (row) => row.Profession,
      sortable: true,
    },

    {
      name: "Actions",
      cell: (row) => (
        <div
          style={{
            // color: "red",
            fontSize: "20px",
            textAlign: "center",
          }}
        >
          <FontAwesomeIcon icon={faEdit} onClick={() => openEditModal(row)} />
        </div>
      ),
      ignoreRowClick: true,
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

  const loadClientData = () => {
    api.get(`/utilisateurs/client`).then((rep) => {
      setClientData(rep.data);
    });
  };

  const resetData = () => {
    setData({
      id: "",
      nom: "",
      cin: "",
      prenom: "",
      adresse: "",
      telephone: "+261",
      profession: "",
    });
  };

  useEffect(() => {
    loadClientData();
  }, []);

  const saveClient = () => {
    // console.log(pret);
    api
      .post("/utilisateurs/client", data)
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
        loadClientData();
        resetData();
      })
      .catch((err) => {
        const errorMsg =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Une erreur est survenue.";
        swal(errorMsg, {
          icon: "error",
          buttons: {
            confirm: {
              className: "btn btn-danger",
            },
          },
        });
      });
  };

  const updateClient = () => {
    // console.log(pret);
    api
      .put(`/utilisateurs/client/${data.id}`, data)
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
        loadClientData();
        resetData();
      })
      .catch((err) => {
        const errorMsg =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Une erreur est survenue.";
        swal(errorMsg, {
          icon: "error",
          buttons: {
            confirm: {
              className: "btn btn-danger",
            },
          },
        });
      });
  };

  const deleteClient = (id) => {
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
        api.delete(`/utilisateurs/client/${id}`).then((rep) => {
          if (rep.data.success) {
            swal(`${rep.data.message}`, {
              icon: "success",
              buttons: {
                confirm: {
                  className: "btn btn-success",
                },
              },
            });
            loadClientData();
          } else {
            swal(`${rep.data.message}`, {
              icon: "error",
              buttons: {
                confirm: {
                  className: "btn btn-success",
                },
              },
            });
            loadClientData();
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

  const [numCin, setNumCin] = useState("");
  const [cinError, setCinError] = useState("");

  const handleChangeCin = (e) => {
    let input = e.target.value;

    input = input.replace(/\D/g, "");

    const validRanges = [
      [101, 119],
      [201, 209],
      [301, 323],
      [401, 421],
      [501, 518],
      [601, 621],
    ];

    const prefix = input.slice(0, 3);
    const prefixNum = parseInt(prefix, 10);

    const isValidPrefix = validRanges.some(
      ([start, end]) => prefixNum >= start && prefixNum <= end
    );

    const formatted = input.match(/.{1,3}/g);
    const result = formatted ? formatted.join(" ") : "";

    if (input.length >= 3 && !isValidPrefix) {
      setCinError("Préfixe CIN invalide !");
    } else {
      setCinError("");
    }

    setNumCin(result);

    setData((prev) => ({
      ...prev,
      cin: result,
    }));
  };

  const formatPhoneNumber = (input) => {
    let digits = input.replace(/\D/g, "");

    if (digits.startsWith("261")) {
      digits = digits.substring(3);
    }

    let formatted = "+261";
    if (digits.length > 0) formatted += " " + digits.substring(0, 2);
    if (digits.length > 2) formatted += " " + digits.substring(2, 4);
    if (digits.length > 4) formatted += " " + digits.substring(4, 7);
    if (digits.length > 7) formatted += " " + digits.substring(7, 9);

    return formatted.trim();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "telephone") {
      const formattedPhone = formatPhoneNumber(value);
      setData((prevData) => ({
        ...prevData,
        [name]: formattedPhone,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    const regex = /^\+261 (32|33|34|38) \d{2} \d{3} \d{2}$/;
    const { telephone } = data;

    if (telephone.trim() === "+261") {
      setPhoneError("");
    } else if (!regex.test(telephone)) {
      setPhoneError("Numéro invalide. Format attendu : +261 34 74 481 02");
    } else {
      setPhoneError("");
    }
  }, [data.telephone]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clientData.filter((client) =>
    (
      client.Nom +
      " " +
      client.Prenom +
      " " +
      client.Cin +
      " " +
      client.Adresse +
      " " +
      client.Telephone +
      " " +
      client.Profession
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const ExporterExcel = () => {
    if (clientData.length > 0) {
      const donnees = clientData.map((client) => ({
        Cin: client.Cin,
        Nom: client.Nom,
        Prenom: client.Prenom,
        Adresse: client.Adresse,
        Contact: client.Telephone,
        Profession: client.Profession,
      }));

      const ws = XLSX.utils.json_to_sheet(donnees);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Clients");
      XLSX.writeFile(wb, "liste_clients.xlsx");
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
    const colonnes = [
      "NUM CIN",
      "NOM",
      "PRENOM",
      "ADRESSE",
      "TELEPHONE",
      "PROFESSION",
    ];
    const ligne = clientData.map((ligne) => [
      ligne.Cin.replace(/(.{3})/g, "$1 ").trim(),
      ligne.Nom,
      ligne.Prenom,
      ligne.Adresse,
      ligne.Telephone,
      ligne.Profession,
    ]);

    if (clientData.length > 0) {
      doc.text(`Liste de nos clients`, 15, 10);
      doc.autoTable({
        head: [colonnes],
        body: ligne,
        startY: 20,
      });

      doc.save(`liste_client.pdf`);
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
      <h2 style={{ textAlign: "start" }}>Liste des clients enregistrés</h2>

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
                <h2>Nouveau Client</h2>
                <FontAwesomeIcon
                  onClick={() => setIsActive(false)}
                  size="2x"
                  style={{ color: "red" }}
                  icon={faTimes}
                />
              </div>
              <br />

              <div className="form-group">
                <label htmlFor="numCompte">Nom</label>
                <input
                  type="text"
                  name="nom"
                  required
                  id="nom"
                  placeholder="Nom"
                  value={data.nom}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="numCompte">Prenom</label>
                <input
                  // style={{ backgroundColor: "#fffcc8" }}
                  required
                  type="text"
                  placeholder="Prenom"
                  onChange={handleChange}
                  name="prenom"
                  value={data.prenom}
                />
              </div>
              <div className="form-group">
                <label htmlFor="numCompte">Numero de Carte d'identite</label>
                <input
                  required
                  // style={{ backgroundColor: "#fffcc8" }}
                  type="text"
                  placeholder="Carte d'identité nationale"
                  onChange={handleChangeCin}
                  name="cin"
                  value={numCin}
                  maxLength={15}
                />
              </div>
              {cinError && (
                <span
                  style={{
                    textAlign: "center",
                    color: "red",
                    paddingBottom: "5px",
                  }}
                >
                  {cinError}
                </span>
              )}

              <div className="form-group">
                <label htmlFor="numCompte">Adresse</label>
                <input
                  required
                  type="text"
                  name="adresse"
                  value={data.adresse}
                  onChange={handleChange}
                  placeholder="Adresse"
                  // min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="numCompte">Numero telephone</label>
                <input
                  required
                  type="text"
                  name="telephone"
                  value={data.telephone}
                  onChange={handleChange}
                  placeholder="Numero de telephone"
                />
              </div>
              <div className="form-group">
                <label htmlFor="numCompte">Profession</label>
                <input
                  required
                  type="text"
                  name="profession"
                  value={data.profession}
                  onChange={handleChange}
                  placeholder="Profession"
                />
              </div>
              <div className="btn-save">
                <button
                  type="button"
                  onClick={() => {
                    saveClient();
                  }}
                >
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
                <label htmlFor="numCompte">Nom</label>
                <input
                  type="text"
                  required
                  name="nom"
                  placeholder="Nom"
                  id="nom"
                  value={data.nom}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="numCompte">Prenom</label>
                <input
                  required
                  // style={{ backgroundColor: "#fffcc8" }}
                  type="text"
                  placeholder="Prenom"
                  onChange={handleChange}
                  name="prenom"
                  value={data.prenom}
                />
              </div>
              <div className="form-group">
                <label htmlFor="numCompte">Numero de carte d'identite</label>
                <input
                  required
                  // style={{ backgroundColor: "#fffcc8" }}
                  type="text"
                  placeholder="Carte d'identité nationale"
                  onChange={handleChange}
                  name="cin"
                  value={data.cin}
                />
              </div>
              <div className="form-group">
                <label htmlFor="numCompte">Adresse</label>
                <input
                  required
                  type="text"
                  name="adresse"
                  value={data.adresse}
                  onChange={handleChange}
                  placeholder="Adresse"
                  // min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="numCompte">Numero telephone</label>
                <input
                  required
                  type="text"
                  name="telephone"
                  value={data.telephone}
                  onChange={handleChange}
                  placeholder="Numero de telephone"
                />
              </div>
              <div className="form-group">
                <label htmlFor="numCompte">Profession</label>
                <input
                  required
                  type="text"
                  name="profession"
                  value={data.profession}
                  onChange={handleChange}
                  placeholder="Profession"
                />
              </div>
              <div className="btn-save">
                <button
                  type="button"
                  onClick={() => {
                    updateClient();
                  }}
                >
                  <FontAwesomeIcon icon={faSave} /> &nbsp;&nbsp; Modifier
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
                &nbsp;&nbsp; Ajouter client
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
              
              <th>CIN</th>
              <th>NOM</th>
              <th>PRENOM</th>
              <th>ADRESSE</th>
              <th>TELEPHONE</th>
              <th>PROFESSION</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients && filteredClients.length > 0 ? (
              filteredClients.map((item) => (
                <tr key={item.IdUt}>
                  <td>{item.Cin}</td>
                  <td>{item.Nom}</td>
                  <td>{item.Prenom}</td>
                  <td>{item.Adresse}</td>
                  <td>{item.Telephone}</td>
                  <td>{item.Profession}</td>
                  <td
                    style={{
                      color: "red",
                      fontSize: "20px",
                      textAlign: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faEdit}
                      onClick={() => openEditModal(item)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
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
            data={filteredClients}
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
      </div>
    </div>
  );
};

export default Client;
