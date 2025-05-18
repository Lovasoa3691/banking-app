import React, { useEffect, useState } from "react";
import "../../../assets/css/navbar.css";
import logo from "../../../assets/images/bankColored.png";
import userLogo from "../../../assets/images/user.png";
import Dashboard from "./dashAdmin";
import Client from "./client";
import Compte from "./compte";
import Pret from "./pret";
import Transaction from "./transactionA";
import Profil from "./profilAdmin";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Outlet,
} from "react-router-dom";

import axios from "axios";
import api from "../../api/api";

axios.defaults.withCredentials = true;

const Navbar = () => {
  const navigate = useNavigate();

  const [isActive, setActive] = useState("");

  const menuClick = (menu, path) => {
    setActive(menu);
    navigate(path);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [user, setUser] = useState({});

  useEffect(() => {
    api
      .get("/utilisateurs/me")
      .then((rep) => {
        // console.log(rep.data);
        setUser(rep.data.user);
      })
      .catch((err) => {
        console.log("Uitlisateur non connecte: ", err);
      });
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="navbar">
      <div className={`sideBar ${sidebarOpen ? "open" : ""}`}>
        <div className="col">
          <img src={logo} width={50} height={50} alt="" /> &nbsp;&nbsp;
          <span style={{ fontSize: "40px" }}>F-BANKY</span>
        </div>

        <br />
        <br />
        <nav>
          <li className="headMenu">Accueil</li>

          <li
            className={isActive === "dashboard" ? "submenu active" : "submenu"}
            onClick={() => menuClick("dashboard", "/admin/dashboard")}
          >
            <i className="fa-solid fa-chart-line"></i> &nbsp;&nbsp;&nbsp;&nbsp;
            Tableau de bord
          </li>

          <li className="headMenu">Utilisateurs</li>

          <li
            className={isActive === "client" ? "submenu active" : "submenu"}
            onClick={() => menuClick("client", "/admin/client")}
          >
            <i className="fa-solid fa-right-left"></i> &nbsp;&nbsp;&nbsp;&nbsp;
            Client
          </li>

          <li className="headMenu">Produit bancaire</li>

          <li
            className={isActive === "compte" ? "submenu active" : "submenu"}
            onClick={() => menuClick("compte", "/admin/compte")}
          >
            <i className="fa-solid fa-right-left"></i> &nbsp;&nbsp;&nbsp;&nbsp;
            Comptes
          </li>
          <li
            className={isActive === "pret" ? "submenu active" : "submenu"}
            onClick={() => menuClick("pret", "/admin/pret")}
          >
            <i className="fa-solid fa-money-bill-wave"></i>{" "}
            &nbsp;&nbsp;&nbsp;&nbsp; Demande des Prets
          </li>

          {/* <li
            className={
              isActive === "trasanction" ? "submenu active" : "submenu"
            }
            onClick={() => menuClick("trasanction", "/admin/trasanctions")}
          >
            <i className="fa-solid fa-hand-holding-dollar"></i>{" "}
            &nbsp;&nbsp;&nbsp;&nbsp; Suivi des trasanctions
          </li> */}

          <li className="headMenu">Profil</li>

          <li
            className={isActive === "info" ? "submenu active" : "submenu"}
            onClick={() => menuClick("info", "/admin/profile")}
          >
            <i className="fa-solid fa-circle-info"></i> &nbsp;&nbsp;&nbsp;&nbsp;
            Infos & Securite
          </li>

          <li
            className={isActive === "logout" ? "submenu active" : "submenu"}
            onClick={() => {
              logout();
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>{" "}
            &nbsp;&nbsp;&nbsp;&nbsp; Deconnection
          </li>
        </nav>
      </div>

      <div className="main">
        <div className="top-bar">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            &#9776;
          </button>

          <div style={{ float: "right", paddingTop: "10px" }}>
            <span>{user.email}</span>
          </div>
        </div>

        <div className="data-content">
          <Routes>
            <Route path="dashboard" element={<Dashboard />}></Route>
            <Route path="client" element={<Client />}></Route>
            <Route path="compte" element={<Compte />}></Route>
            <Route path="pret" element={<Pret />}></Route>
            {/* <Route path="trasanctions " element={<Transaction />}></Route> */}
            <Route path="profile" element={<Profil />}></Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
