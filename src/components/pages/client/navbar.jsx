import React, { useEffect, useState } from "react";
import "../../../assets/css/navbar.css";
import logo from "../../../assets/images/bankColored.png";
import userLogo from "../../../assets/images/user.png";
import Dashboard from "./dashboard";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Outlet,
} from "react-router-dom";
import Retrait from "./retrait";
import Virement from "./virement";
import Pret from "./pret";
import Profil from "./profil";
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

  return (
    <div className="navbar">
      <div className="sideBar">
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
            onClick={() => menuClick("dashboard", "/client/dashboard")}
          >
            <i className="fa-solid fa-chart-line"></i> &nbsp;&nbsp;&nbsp;&nbsp;
            Tableau de bord
          </li>

          <li className="headMenu">Operation</li>

          <li
            className={isActive === "transfert" ? "submenu active" : "submenu"}
            onClick={() => menuClick("transfert", "/client/virement")}
          >
            <i className="fa-solid fa-right-left"></i> &nbsp;&nbsp;&nbsp;&nbsp;
            Transfert / Virement
          </li>
          <li
            className={isActive === "retrait" ? "submenu active" : "submenu"}
            onClick={() => menuClick("retrait", "/client/retrait")}
          >
            <i className="fa-solid fa-money-bill-wave"></i>{" "}
            &nbsp;&nbsp;&nbsp;&nbsp; Retrait
          </li>

          <li
            className={isActive === "pret" ? "submenu active" : "submenu"}
            onClick={() => menuClick("pret", "/client/pret")}
          >
            <i className="fa-solid fa-hand-holding-dollar"></i>{" "}
            &nbsp;&nbsp;&nbsp;&nbsp; Credit / Pret
          </li>

          <li className="headMenu">Profil</li>

          <li
            className={isActive === "info" ? "submenu active" : "submenu"}
            onClick={() => menuClick("info", "/client/profile")}
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
          <div className="item-box">
            {/* <div>
              <input type="text" placeholder="Recherche" />
            </div> */}

            <div style={{ float: "right", paddingTop: "15px" }}>
              {/* <img src={userLogo} width={50} height={50} alt="" /> &nbsp;&nbsp; */}
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        <div className="data-content">
          <Routes>
            <Route path="dashboard" element={<Dashboard />}></Route>
            <Route path="retrait" element={<Retrait />}></Route>
            <Route path="virement" element={<Virement />}></Route>
            <Route path="pret" element={<Pret />}></Route>
            <Route path="profile" element={<Profil />}></Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
