import React, { useEffect, useState } from "react";
import "../../../assets/css/dashboard.css";
import LineChart from "../../../assets/chart/line";
import api from "../../api/api";
import accounting from "../../../assets/images/accounting.png";
import cash from "../../../assets/images/cash.png";
import customer from "../../../assets/images/customers.png";

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
      <div style={{ padding: "30px" }} className="card-body">
        <div
          className="card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "20px",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              Total Client
            </span>
            <br />
            <br />
            <strong style={{ fontSize: "40px", fontWeight: "bold" }}>30</strong>
          </div>
          <img src={customer} alt="" width={100} height={100} />
        </div>

        <div
          className="card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "20px",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              Nombre de compte ouvert
            </span>
            <br />
            <br />
            <strong style={{ fontSize: "40px", fontWeight: "bold" }}>30</strong>
          </div>
          <img src={accounting} alt="" width={100} height={100} />
        </div>

        <div
          className="card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "20px",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              Solde total cumule
            </span>
            <br />
            <br />
            <strong style={{ fontSize: "40px", fontWeight: "bold" }}>
              100,000.00
            </strong>
          </div>
          <img src={cash} alt="" width={100} height={100} />
        </div>
      </div>

      <div>
        <div className="tableContent">
          {/* <div className="connectivity">
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
          </div> */}

          <div className="table">
            <LineChart />
          </div>
        </div>

        <div className="table">
          <h2>Liste des recentes trasanctions</h2>
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
              {/* {listOperation && listOperation.length > 0 ? (
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
              )} */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Dashboard;
