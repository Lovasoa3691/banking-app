import { useEffect, useState } from "react";
import api from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Virement = () => {
  const [user, setUser] = useState({});
  const [clientInfo, setClientInfo] = useState({});
  const [virement, setVirement] = useState({
    montant: 0,
    numCompte: "",
    motif: "",
    destinataire: "",
  });

  const [numCompte, setNumCompte] = useState("");
  const [virementtData, setVirementData] = useState([]);

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
        virement.numCompte = rep.data.client.NumCompte;
        setNumCompte(rep.data.client.NumCompte);
      })
      .catch((err) => {
        console.log("Compte non trouve: ", err);
      });
  }, []);

  const loadVirementData = () => {
    api.get(`/operations/virement/${numCompte}`).then((rep) => {
      setVirementData(rep.data);
    });
  };

  const resetData = () => {
    setVirement({
      montant: 0,
      numCompte: "",
      motif: "",
      destinataire: "",
    });
  };

  useEffect(() => {
    loadVirementData();
  }, [numCompte]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVirement({ ...virement, [name]: value });
  };

  const doVirement = () => {
    // console.log(virement);
    api
      .post("/operations/virement", virement)
      .then((rep) => {
        // console.log(rep.data);
        loadVirementData();
        resetData();
      })
      .catch((err) => {
        console.log(err);
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

    setVirement((prev) => ({
      ...prev,
      destinataire: input,
    }));
  };

  return (
    <div className="container-data">
      <form className="withdraw-form">
        <h2>Formulaire de Virement</h2>
        <input
          type="text"
          style={{ backgroundColor: "#fffcc8" }}
          disabled
          name="numCompte"
          value={clientInfo.NumCompte}
          placeholder="Numero de compte expediteur"
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
          value={virement.montant}
          onChange={handleChange}
          placeholder="Montant à transferer"
        />
        <textarea
          placeholder="Motif du virement"
          name="motif"
          value={virement.motif}
          onChange={handleChange}
        ></textarea>
        <button
          onClick={() => {
            doVirement();
          }}
          type="button"
        >
          Effectuer le virement
        </button>
        {/* <button type="button">Vider</button> */}
      </form>

      <div className="transaction-history">
        <div className="history-toolbar">
          <input type="text" placeholder="Rechercher..." />
          <div className="actions">
            <button>📄 Exporter en PDF</button>
            <button>📊 Exporter en Excel</button>
            <button>🖨️ Imprimer</button>
          </div>
        </div>

        <div className="transaction-list">
          {virementtData && virementtData.length > 0 ? (
            virementtData.map((item) => (
              <div key={item.NumOp} className="transaction-row">
                <div className="transaction-date">{item.NumDest}</div>
                <div className="transaction-date">{item.DateOp}</div>
                <div className="transaction-amount">
                  {item.Montant.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  Ar
                </div>
                <div className="transaction-date">Reucus</div>
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
    </div>
  );
};

export default Virement;
