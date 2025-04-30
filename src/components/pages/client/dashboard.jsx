import React, { useEffect, useState } from "react";
import "../../../assets/css/dashboard.css";
import moneybag from "../../../assets/images/money-bag.png";
import BarChart from "../../../assets/chart/bar";
import { Bar } from "react-chartjs-2";
import LineChart from "../../../assets/chart/line";
import api from "../../api/api";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [clientInfo, setClientInfo] = useState({});

  const [numCompte, setNumCompte] = useState("");
  const [listOperation, setOperations] = useState([]);

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
        // console.log(rep.data.client);
        setClientInfo(rep.data.client);
        // pret.numCompte = rep.data.client.NumCompte;
        setNumCompte(rep.data.client.NumCompte);
      })
      .catch((err) => {
        console.log("Compte non trouve: ", err);
      });
  }, []);

  useEffect(() => {
    api
      .get(`/operations/client/${numCompte}`)
      .then((rep) => {
        // console.log(rep.data);
        setOperations(rep.data);
      })
      .catch((err) => {
        console.log("Compte non trouve: ", err);
      });
  }, [numCompte]);

  const loadVirementData = () => {
    api.get(`/operations/virement/${numCompte}`).then((rep) => {
      // setVirementData(rep.data);
    });
  };

  return (
    // <div className="container">

    <div className="dash-content">
      <div className="card-body">
        <div className="card">
          <span style={{ fontSize: "25px", fontWeight: "bold" }}>
            Infos utilisateur
          </span>
          <br />
          <br />
          <span>{user.nom + " " + user.prenom}</span>
          <br />
          <br />
          <span>
            N Compte : <strong>{clientInfo.NumCompte}</strong>
          </span>
          <br />
          <br />
          <span>
            Type :{" "}
            <select
              disabled
              name=""
              id=""
              style={{
                padding: "5px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor: "#f9f9f9",
                color: "#333",
                fontSize: "16px",
                outline: "none",
                width: "200px",
                cursor: "pointer",
              }}
            >
              <option value="">{clientInfo.Discriminator}</option>
            </select>
          </span>
          <br />
          <br />
          <span>Cree le : {clientInfo.DateOuverture}</span>
        </div>

        <div className="card">
          <div className="child-card">
            <div className="item">
              <img src={moneybag} width={70} height={70} alt="" />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <div>
                <span style={{ fontSize: "30px" }}>Solde actuel</span>
                <br />
                <strong style={{ fontSize: "40px" }}>
                  {clientInfo.Solde} Ar
                </strong>
              </div>
            </div>
            <div className="item">
              <button type="button">Afficher historique</button>
            </div>
          </div>
        </div>

        <div className="card">
          <button type="button">
            {" "}
            <i className="fa-solid fa-chart-line"></i>&nbsp;&nbsp; Virement
          </button>
          &nbsp;&nbsp;
          <button type="button">
            <i className="fa-solid fa-money-bill-wave"></i>&nbsp;&nbsp; Retrait
          </button>
          &nbsp;&nbsp;
          <button type="button">
            <i className="fa-solid fa-right-left"></i>&nbsp;&nbsp; Transfert
          </button>
        </div>
      </div>

      <div>
        <div className="tableContent">
          <div className="connectivity">
            <div className="card">
              <span>Status de securite</span>
              <br />
              <br />
              <span>
                <i className="fa-solid fa-lock"></i>
                &nbsp;&nbsp;Authentification 2FA:
                <strong>Desactive</strong>
              </span>{" "}
              <br />
              <br />
              <strong>
                <i className="fa-solid fa-mobile"></i> &nbsp;&nbsp;Appareil lie
                : Redmi 6 Pro
              </strong>
              <br />
              <br />
              <span>
                <i className="fa-solid fa-clock"></i> &nbsp;&nbsp;
                <strong></strong>Derniere connection : <br /> le 01/02/2019
                12:43:45
              </span>
              <br />
              <br />
            </div>
          </div>

          <div className="table">
            <LineChart />
          </div>
        </div>

        <div className="table">
          <h2>Resume des dernieres operations</h2>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {listOperation && listOperation.length > 0 ? (
                listOperation.map((item) => (
                  <tr>
                    <td>{item.DateOp}</td>
                    <td>{item.Discriminator}</td>
                    <td>
                      {item.Montant.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      Ar
                    </td>
                    <td>{item.StatusP}</td>
                  </tr>
                ))
              ) : (
                <tr></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Dashboard;
