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
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

const Pret = () => {
  const [user, setUser] = useState({});
  const [clientInfo, setClientInfo] = useState({});
  const [pret, setPret] = useState({
    montant: 0,
    numCompte: "",
    duree: "",
    motif: "",
    codePin: "",
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
    api.get(`/operations/pret/${numCompte}`).then((rep) => {
      setPretData(rep.data);
    });
  };

  const resetData = () => {
    setPret({
      montant: 0,
      numCompte: "",
      duree: "",
      motif: "",
      revenu: 0,
      codePin: "",
    });
  };

  useEffect(() => {
    loadPretData();
  }, [numCompte]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPret({ ...pret, [name]: value });
  };

  const doPret = () => {
    api
      .post("/operations/pret", pret)
      .then((rep) => {
        if (!rep.data.success) {
          swal({
            title: "Erreur",
            text: rep.data.message || "Une erreur s'est produite",
            icon: "error",
            buttons: {
              confirm: {
                className: "btn btn-danger",
              },
            },
          });
          return;
        }

        swal({
          title: "Succès",
          text: rep.data.message,
          icon: "success",
          buttons: {
            confirm: {
              className: "btn btn-success",
            },
          },
        });
        loadPretData();
        resetData();
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

  const options = [
    { value: "En attente", label: "En attente" },
    { value: "Approuver", label: "Approuver" },
    { value: "Refuse", label: "Refuse" },
  ];

  return (
    <div className="container-data">
      {/* <h2>Formulaire de Demande de Pret</h2> */}

      <form className="withdraw-form">
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

        <input
          type="password"
          name="codePin"
          value={pret.codePin}
          placeholder="Code PIN"
          inputMode="numeric" // affiche le pavé numérique sur mobile
          pattern="[0-9]*" // hint pour le navigateur
          maxLength={4} // si le code PIN est à 4 chiffres
          onChange={(e) => {
            const onlyNums = e.target.value.replace(/\D/, "");
            setPret({ ...pret, codePin: onlyNums });
          }}
        />

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
          {/* Soumettre la demande */}
        </button>
      </form>

      <div className="transaction-history">
        <div className="history-toolbar">
          <div styles={{ width: "100px" }}>
            <Select
              styles={{
                control: (base) => ({
                  ...base,
                  width: 250,
                }),
              }}
              options={options}
            />
          </div>

          <div className="actions">
            <button>
              <FontAwesomeIcon icon={faFilePdf} />
            </button>
            <button>
              <FontAwesomeIcon icon={faFileExcel} />
            </button>
            <button>
              <FontAwesomeIcon icon={faPrint} />
            </button>
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Motif</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pretData && pretData.length > 0 ? (
              pretData.map((item) => (
                <tr key={item.NumOp}>
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
                  <td
                    style={{
                      color: "red",
                      fontSize: "20px",
                      textAlign: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      onClick={() => deleteHistorique(item.NumOp)}
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
      </div>
    </div>
  );
};

export default Pret;
