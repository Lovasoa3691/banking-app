import React from "react";
import "../../assets/css/login.css";
import logo from "../../assets/images/bank.png";
import { Link } from "react-router-dom";
import api from "../api/api";

const Register = () => {
  const register = () => {
    api
      .post("/utilisateurs/register")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // e.preventDefault();
  };

  return (
    <div className="container">
      <img src={logo} width={100} height={100} alt="" />

      <h2 style={{ fontSize: "35px" }}>Bienvenue</h2>
      <span className="text-bold">Inscrivez-vous</span>

      <form action="">
        <div className="col">
          <div className="row">
            <label htmlFor="nom">Nom</label>

            <input type="text" placeholder="John" />
          </div>

          <div className="row">
            <label htmlFor="prenom">Prenom</label>

            <input type="text" placeholder="Doe" />
          </div>
        </div>

        <div className="row">
          <label htmlFor="login">Adresse email</label>

          <input type="email" placeholder="@gmail.com" />
        </div>

        <div className="row">
          <label htmlFor="password">Mot de passe</label>

          <input type="password" placeholder="***********" />
        </div>

        <div className="row">
          <label htmlFor="password">Confirmation</label>

          <input type="password" placeholder="***********" />
        </div>

        <span className="text-primary text-bold">Mot de passe oublie?</span>
        <br />
        <br />

        <div className="row">
          <button type="button">Creer compte</button>
        </div>

        <br />

        <span>
          Avez-vous un compte?{" "}
          <Link to="/" className="text-bold">
            {" "}
            Se connecter
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
