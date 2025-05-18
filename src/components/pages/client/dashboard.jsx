import React, { useEffect, useState } from "react";
import "../../../assets/css/dashboard.css";
import moneybag from "../../../assets/images/money-bag.png";
import BarChart from "../../../assets/chart/bar";
import { Bar } from "react-chartjs-2";
import LineChart from "../../../assets/chart/line";
import api from "../../api/api";
import LineChartClient from "../../../assets/chart/lineClient";
import { replace, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

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
        setClientInfo(rep.data.client);

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
        setOperations(rep.data);
      })
      .catch((err) => {
        console.log("Compte non trouve: ", err);
      });
  }, [numCompte]);

  const changeMenu = (path) => {
    navigate(`/client/${path}`, replace);
  };

  const formatDate = (dateStr) => {
    return dateStr.split("T")[0];
  };

  return (
    <div className="dash-content">
      <div className="card-body">
        <div className="card-box">
          <span style={{ fontSize: "25px", fontWeight: "bold" }}>
            Infos utilisateur
          </span>
          <br />
          <br />
          <span>{user.nom + " " + user.prenom}</span>
          <br />
          <br />
          <span>
            N Compte :{" "}
            <strong>
              {numCompte
                ? numCompte.replace(/(.{4})/g, "$1 ").trim()
                : "Chargement..."}
            </strong>
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
                // width: "200px",
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

        <div className="card-box">
          <div className="child-card">
            <div className="item">
              <img src={moneybag} width={70} height={70} alt="" />

              <div>
                <span style={{ fontSize: "30px" }}>Balance</span>
                <br />
                <strong style={{ fontSize: "40px" }}>
                  {clientInfo.Solde !== undefined
                    ? clientInfo.Solde.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) + " Ar"
                    : "Chargement..."}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="card-box">
          <button type="button" onClick={() => changeMenu("virement")}>
            {" "}
            <i className="fa-solid fa-chart-line"></i>&nbsp;&nbsp; Virement
          </button>
          &nbsp;&nbsp;
          <button type="button" onClick={() => changeMenu("retrait")}>
            <i className="fa-solid fa-money-bill-wave"></i>&nbsp;&nbsp; Retrait
          </button>
          &nbsp;&nbsp;
          <button type="button" onClick={() => changeMenu("pret")}>
            <i className="fa-solid fa-right-left"></i>&nbsp;&nbsp; Pret
          </button>
        </div>
      </div>

      <div>
        <div className="tableContent">
          {!numCompte ? (
            <p>Chargement...</p>
          ) : (
            <div className="graphic-view">
              <LineChartClient numCompte={numCompte} />
            </div>
          )}
        </div>

        <div className="table">
          <h2>Resume des dernieres trasanctions</h2>
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
                  <tr key={item.NumOp}>
                    <td data-label="Date">{formatDate(item.DateOp)}</td>
                    <td data-label="Type">{item.Discriminator}</td>
                    <td data-label="Montant">
                      {item.Montant.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      Ar
                    </td>
                    <td data-label="Statut">{item.StatusP}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
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
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
