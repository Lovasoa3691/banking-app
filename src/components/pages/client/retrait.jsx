import React, { useEffect, useRef, useState } from "react";
import api from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import html2pdf from "html2pdf.js";
import Recu from "./recu";
import { createRoot } from "react-dom/client";

const Retrait = () => {
  const [user, setUser] = useState({});
  const [clientInfo, setClientInfo] = useState({});

  const [numCompte, setNumCompte] = useState("");
  const [retraitData, setRetraitData] = useState([]);
  const [retrait, setRetrait] = useState({
    type: "Retrait",
    montant: 0,
    numCompte: "",
    destinataire: "",
    motif: "",
    codePin: "",
    date: "",
    titulaire: "",
  });

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
        retrait.numCompte = rep.data.client.NumCompte;
        retrait.titulaire = user.nom + " " + user.prenom;
        retrait.date = new Date().toLocaleString("fr-FR");
        setNumCompte(rep.data.client.NumCompte);
      })
      .catch((err) => {
        console.log("Compte non trouve: ", err);
      });
  }, [user]);

  const loadRetraitData = () => {
    api.get(`/operations/retrait/${numCompte}`).then((rep) => {
      setRetraitData(rep.data);
    });
  };

  const resetData = () => {
    setRetrait({
      type: "Retrait",
      montant: 0,
      numCompte: "",
      motif: "",
      codePin: "",
      destinataire: "",
      date: "",
      titulaire: "",
    });
  };

  useEffect(() => {
    loadRetraitData();
  }, [numCompte]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRetrait({ ...retrait, [name]: value });
  };

  const doRetrait = () => {
    api
      .post("/operations/retrait", retrait)
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
              text: "OK",
            },
          },
        }).then(() => {
          swal({
            title: "Impression du reçu",
            text: "Souhaitez-vous imprimer le reçu ?",
            icon: "info",
            buttons: {
              cancel: {
                text: "Non",
                visible: true,
                className: "btn btn-secondary",
              },
              confirm: {
                text: "Oui",
                className: "btn btn-primary",
              },
            },
          }).then((willPrint) => {
            if (willPrint) {
              generatePDF();
            }
          });
          loadRetraitData();
          resetData();
        });
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
            loadRetraitData();
          } else {
            swal(`${rep.data.message}`, {
              icon: "error",
              buttons: {
                confirm: {
                  className: "btn btn-success",
                },
              },
            });
            loadRetraitData();
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

  const [numDest, setNumDest] = useState("");

  const handleChangeCompteDest = (e) => {
    let input = e.target.value;

    input = input.replace(/\D/g, "");

    input = input.match(/.{1,4}/g);

    if (input) {
      input = input.join(" ");
    } else {
      input = "";
    }

    setNumDest(input);

    setRetrait((prev) => ({
      ...prev,
      destinataire: input,
    }));
  };

  const generatePDF = () => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    const root = createRoot(div);
    root.render(<Recu {...retrait} />);

    setTimeout(() => {
      const opt = {
        margin: 1,
        filename: `recu${retrait.numCompte}.pdf`,
        html2canvas: {
          scale: 2,
          logging: true,
          useCORS: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      html2pdf()
        .from(div)
        .set(opt)
        .save()
        .then(() => {
          root.unmount();
          document.body.removeChild(div);
        })
        .catch(() => {
          console.error("Erreur lors de la génération du PDF");
          root.unmount();
          document.body.removeChild(div);
        });
    }, 1000);
  };

  return (
    <div className="container-data">
      <form className="withdraw-form">
        <h2>Formulaire de Retrait</h2>
        <input
          style={{ backgroundColor: "#fffcc8" }}
          disabled
          type="text"
          value={user.nom + " " + user.prenom}
          placeholder="Nom du titulaire"
        />
        <input
          style={{ backgroundColor: "#fffcc8" }}
          disabled
          type="text"
          name="numCompte"
          value={clientInfo.NumCompte}
          placeholder="Numéro de compte"
        />
        <input
          type="text"
          name="destinataire"
          value={numDest}
          onChange={handleChangeCompteDest}
          maxLength={19}
          placeholder="Numéro de compte destinataire"
        />
        <input
          type="number"
          name="montant"
          value={retrait.montant}
          onChange={handleChange}
          placeholder="Montant a retirer"
          min="0"
        />
        <textarea
          name="motif"
          placeholder="Motif (optionnel)"
          value={retrait.motif}
          onChange={handleChange}
        ></textarea>
        <input
          type="password"
          name="codePin"
          value={retrait.codePin}
          placeholder="Code PIN"
          inputMode="numeric" // affiche le pavé numérique sur mobile
          pattern="[0-9]*" // hint pour le navigateur
          maxLength={4} // si le code PIN est à 4 chiffres
          onChange={(e) => {
            const onlyNums = e.target.value.replace(/\D/, "");
            setRetrait({ ...retrait, codePin: onlyNums });
          }}
        />
        <button
          onClick={() => {
            doRetrait();
          }}
          type="button"
        >
          Valider le retrait
        </button>
        {/* &nbsp;&nbsp;&nbsp;
        <button onClick={generatePDF} type="button">
          Vider
        </button> */}
      </form>

      <div className="transaction-history">
        <div className="history-toolbar">
          <h2>Historiques de transactions</h2>
          <div className="actions">
            <button>📄 Exporter en PDF</button>
            <button>📊 Exporter en Excel</button>
            <button>🖨️ Imprimer</button>
          </div>
        </div>

        <div className="transaction-list">
          {retraitData && retraitData.length > 0 ? (
            retraitData.map((item) => (
              <div key={item.NumOp} className="transaction-row">
                <div className="transaction-date">{item.DateOp}</div>
                <div className="transaction-amount">
                  {item.Montant.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  Ar
                </div>
                <div className="transaction-action">
                  <FontAwesomeIcon
                    onClick={() => deleteHistorique(item.NumOp)}
                    icon={faTrash}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="no-transaction">Aucune transaction disponible.</div>
          )}
        </div>
      </div>

      {/* <div ref={receiptRef} style={{ display: "none", padding: "30px" }}>
        <h2 style={{ textAlign: "center" }}>Reçu de Retrait</h2>

        <p>Numéro de Compte : {retraitData.numCompte}</p>
        <p>Montant Retiré : {retraitData.montant} FCFA</p>
        <p>Motif : {retraitData.motif}</p>
        <p>Date : {retraitData.date}</p>
        <p>Opérateur : {retraitData.nomOperateur}</p>
        <hr />
        <p>Merci d’avoir utilisé notre service.</p>
      </div> */}
    </div>
  );
};

export default Retrait;
