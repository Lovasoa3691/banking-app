import React, { useEffect, useState } from "react";
import "../../../assets/css/dashboard.css";
import LineChart from "../../../assets/chart/line";
import api from "../../api/api";
import accounting from "../../../assets/images/accounting.png";
import cash from "../../../assets/images/cash.png";
import customer from "../../../assets/images/customers.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faMoneyBill1Wave,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [operationData, setOperationData] = useState([]);
  const [totalClient, setTotalClient] = useState(0);
  const [totalCompte, setTotalCompte] = useState(0);
  const [totalSolde, setTotalSolde] = useState(0);

  const getClientCount = () => {
    api
      .get("/utilisateurs/client/total")
      .then((rep) => {
        // console.log(rep.data);
        setTotalClient(rep.data.count);
      })
      .catch((err) => {
        console.log("Client non trouve: ", err);
      });
  };

  const getCompteCount = () => {
    api
      .get("/operations/compte/total")
      .then((rep) => {
        setTotalCompte(rep.data.count);
      })
      .catch((err) => {
        console.log("Compte non trouve: ", err);
      });
  };

  const getTotalCurrent = () => {
    api
      .get("/operations/current/total")
      .then((rep) => {
        setTotalSolde(rep.data.total);
      })
      .catch((err) => {
        console.log("Solde non trouve: ", err);
      });
  };

  const getCurrentOperations = () => {
    api
      .get("/operations/current")
      .then((rep) => {
        // console.log(rep.data);
        setOperationData(rep.data);
      })
      .catch((err) => {
        console.log("Erreur lors de la récupération des opérations: ", err);
      });
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
    getClientCount();
    getCompteCount();
    getTotalCurrent();
    getCurrentOperations();
  }, []);

  return (
    // <div className="container">

    <div className="dash-content">
      <div style={{ padding: "30px" }} className="card-body">
        <div
          className="card-box"
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
            <strong style={{ fontSize: "40px", fontWeight: "bold" }}>
              {totalClient || 0}
            </strong>
          </div>
          <FontAwesomeIcon style={{ fontSize: "60px" }} icon={faUser} />
          {/* <img src={customer} alt="" width={100} height={100} /> */}
        </div>

        <div
          className="card-box"
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
              Nombre de Compte ouverte
            </span>
            <br />
            <br />
            <strong style={{ fontSize: "40px", fontWeight: "bold" }}>
              {totalCompte || 0}
            </strong>
          </div>
          <FontAwesomeIcon style={{ fontSize: "60px" }} icon={faFolderOpen} />
          {/* <img src={accounting} alt="" width={100} height={100} /> */}
        </div>

        <div
          className="card-box"
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
              {totalSolde != null
                ? `${totalSolde.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} Ar`
                : "0 Ar"}
            </strong>
          </div>
          <FontAwesomeIcon
            // size="3x"
            style={{ fontSize: "60px" }}
            icon={faMoneyBill1Wave}
          />
          {/* <img src={cash} alt="" width={100} height={100} /> */}
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
                <th>COMPTE</th>
                <th>DATE</th>
                <th>TYPE</th>
                <th>MONTANT</th>
              </tr>
            </thead>
            <tbody>
              {operationData && operationData.length > 0 ? (
                operationData.map((item) => (
                  <tr key={item.NumOp}>
                    <td>{item.NumCompte.replace(/(.{4})/g, "$1 ").trim()}</td>
                    <td>{item.DateOp}</td>
                    <td>{item.Discriminator}</td>
                    <td>
                      {item.Montant.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      Ar
                    </td>
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
    // </div>
  );
};

export default Dashboard;
