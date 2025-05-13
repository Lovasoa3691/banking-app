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
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

const Transaction = () => {
  const [user, setUser] = useState({});
  const [clientInfo, setClientInfo] = useState({});
  const [data, setData] = useState({
    nom: "",
    cin: "",
    prenom: "",
    adresse: "",
    telephone: "",
    profession: "",
  });

  const [numCompte, setNumCompte] = useState("");
  const [clientData, setClientData] = useState([]);

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
      nom: "",
      cin: "",
      prenom: "",
      adresse: "",
      telephone: "",
      profession: "",
    });
  };

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    loadClientData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const saveClient = () => {
    // console.log(pret);
    api
      .post("/utilisateurs/client", data)
      .then((rep) => {
        // console.log(rep.data);
        loadClientData();
        resetData();
        setIsActive(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateClient = () => {
    // console.log(pret);
    api
      .put("/utilisateurs/client", data)
      .then((rep) => {
        // console.log(rep.data);
        loadClientData();
        resetData();
      })
      .catch((err) => {
        console.log(err);
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

  const openModal = () => {
    setIsActive(true);
  };

  const options = [
    { value: "En attente", label: "En attente" },
    { value: "Approuver", label: "Approuver" },
    { value: "Refuse", label: "Refuse" },
  ];

  return (
    <div className="container-data">
      <h2 style={{ textAlign: "start" }}>Liste des trasnactions faites par </h2>
      {/* {isActive && (
        <div className="modal">
          <form className="">
            <h2>Nouveau Client</h2>
            <input
              
              type="text"
              placeholder="Nom"
              onChange={handleChange}
              name="nom"
              value={data.nom}
            />
            <input
             
              type="text"
              placeholder="Prenom"
              onChange={handleChange}
              name="prenom"
              value={data.prenom}
            />
            <input
              
              type="text"
              placeholder="Carte d'identité nationale"
              onChange={handleChange}
              name="cin"
              value={data.cin}
            />
            <input
              type="text"
              name="adresse"
              value={data.adresse}
              onChange={handleChange}
              placeholder="Adresse"
              
            />
            <input
              type="text"
              name="telephone"
              value={data.telephone}
              onChange={handleChange}
              placeholder="Numero de telephone"
            />
            <input
              type="text"
              name="profession"
              value={data.profession}
              onChange={handleChange}
              placeholder="Profession"
            />
            <br />

            <button
              type="button"
              onClick={() => {
                saveClient();
              }}
              style={{
                fontSize: "20px",
              }}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </form>
        </div>
      )} */}

      <div className="transaction-history">
        <div className="history-toolbar">
          <div styles={{ width: "100px" }}>
            <div className="action">
              <button onClick={openModal}>
                {" "}
                <FontAwesomeIcon icon={faPlus} />
                &nbsp;&nbsp; Ajouter client
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
              {/* <th>ID</th> */}
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
            {clientData && clientData.length > 0 ? (
              clientData.map((item) => (
                <tr key={item.IdUt}>
                  <td>{item.Cin}</td>
                  <td>{item.Nom}</td>
                  <td>{item.Prenom}</td>
                  <td>{item.Adresse}</td>
                  <td>{item.Telephone}</td>
                  <td>{item.Profession}</td>
                  {/* <td>
                    {item.Montant.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    Ar
                  </td> */}
                  {/* <td>{item.StatusP}</td> */}
                  <td
                    style={{
                      color: "red",
                      fontSize: "20px",
                      textAlign: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      // onClick={() => updateClient(item.NumOp)}
                      icon={faEdit}
                    />
                    &nbsp;&nbsp;&nbsp;
                    <FontAwesomeIcon
                      onClick={() => deleteClient(item.IdUt)}
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

export default Transaction;
