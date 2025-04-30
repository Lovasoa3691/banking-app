import React, { useState } from "react";
import "../../assets/css/login.css";
import logo from "../../assets/images/bank.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/api";

const Login = () => {
  const navigate = useNavigate();
  const [mail, setMail] = useState("");
  const [mdp, setMdp] = useState("");

  const login = () => {
    api
      .post("/utilisateurs/login", {
        Email: mail,
        Mdp: mdp,
      })
      .then((rep) => {
        if (rep.data.success) {
          localStorage.setItem("token", rep.data.token);
          // console.log(rep.data.user);
          navigate(
            rep.data.user.role === "Client"
              ? "/client/dashboard"
              : "/admin/dashboard",
            { replace: true }
          );
        }
      });
  };

  return (
    <div className="container">
      <img src={logo} width={100} height={100} alt="" /> <br />
      <h2 style={{ fontSize: "30px" }}>Bienvenue</h2>
      <span className="text-bold">Connectez-vous s'il vous plait</span>
      <br />
      <br />
      <form action="">
        <div className="row">
          <label htmlFor="login">Adresse email</label>

          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            placeholder="@gmail.com"
          />
        </div>

        <div className="row">
          <label htmlFor="password">Mot de passe</label>

          <input
            type="password"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            placeholder="***********"
          />
        </div>

        <span className="text-primary text-bold">Mot de passe oublie?</span>
        <br />
        <br />
        <br />

        <div className="row">
          <button type="button" onClick={login}>
            Connecter
          </button>
        </div>

        <br />
        <br />

        <span>
          Pas encore un compte?{" "}
          <Link to="/register" className="text-bold">
            {" "}
            Inscrire
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
