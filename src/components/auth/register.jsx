import React, { useEffect, useState } from "react";
import "../../assets/css/login.css";
import logo from "../../assets/images/bank.png";
import { Link } from "react-router-dom";
import api from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";

const Register = () => {
  const [userData, setUserData] = useState({
    email: "",
    phone: "+261",
    password: "",
    confirmPassword: "",
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const formatPhoneNumber = (input) => {
    let digits = input.replace(/\D/g, "");

    if (digits.startsWith("261")) {
      digits = digits.substring(3);
    }

    let formatted = "+261";
    if (digits.length > 0) formatted += " " + digits.substring(0, 2);
    if (digits.length > 2) formatted += " " + digits.substring(2, 4);
    if (digits.length > 4) formatted += " " + digits.substring(4, 7);
    if (digits.length > 7) formatted += " " + digits.substring(7, 9);

    return formatted.trim();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const formattedPhone = formatPhoneNumber(value);
      setUserData((prevData) => ({
        ...prevData,
        [name]: formattedPhone,
      }));
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const { password, confirmPassword } = userData;

    if (confirmPassword === "") {
      setPasswordError(""); // Ne rien afficher si vide
    } else if (password !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas.");
    } else {
      setPasswordError(""); // Efface l'erreur si ça correspond
    }
  }, [userData.password, userData.confirmPassword]);

  useEffect(() => {
    const regex = /^\+261 (32|33|34|38) \d{2} \d{3} \d{2}$/;
    const { phone } = userData;

    if (phone.trim() === "+261") {
      setPhoneError("");
    } else if (!regex.test(phone)) {
      setPhoneError("Numéro invalide. Format attendu : +261 34 74 481 02");
    } else {
      setPhoneError("");
    }
  }, [userData.phone]);

  const register = () => {
    api
      .post("/utilisateurs/register", userData)
      .then((rep) => {
        console.log(rep.data);
      })
      .catch((err) => {
        swal({
          // title: "Erreur",
          text: err.response?.data?.message || "Une erreur s'est produite",
          icon: "error",
          buttons: {
            confirm: {
              className: "btn btn-danger",
            },
          },
        });
      });
  };

  return (
    <div className="wrapper">
      <div className="container">
        <img src={logo} width={100} height={100} alt="" />

        <h2 style={{ fontSize: "35px" }}>Inscrivez-vous</h2>
        {/* <span className="text-bold"></span> */}

        <form action="">
          <div className="row">
            <label htmlFor="login">Adresse email</label>

            <input
              name="email"
              value={userData.email}
              onChange={handleChange}
              type="email"
              placeholder="exemple@gmail.com"
            />
          </div>
          <div className="row">
            <label htmlFor="phone">Numero Telephone</label>

            <input
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              type="text"
              placeholder="+261 XX XX XXX XX"
            />
          </div>

          <div className="row">
            <label htmlFor="password">Mot de passe</label>

            <input
              name="password"
              value={userData.password}
              onChange={handleChange}
              type="password"
              placeholder="******"
            />
          </div>

          <div className="row">
            <label htmlFor="password">Confirmation</label>

            <input
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              type="password"
              placeholder="******"
            />
          </div>
          {phoneError && (
            <span
              style={{ color: "red", fontSize: "0.9em", textAlign: "center" }}
            >
              <FontAwesomeIcon icon={faExclamationCircle} />
              &nbsp; {phoneError}
            </span>
          )}
          {passwordError && (
            <span
              style={{ color: "red", fontSize: "0.9em", textAlign: "center" }}
            >
              <FontAwesomeIcon icon={faExclamationCircle} />
              &nbsp; Les mots de passe ne correspondent pas.
            </span>
          )}
          <br />

          <div className="row">
            <button
              onClick={() => {
                register();
                setUserData({
                  email: "",
                  phone: "+261",
                  password: "",
                  confirmPassword: "",
                });
              }}
              type="button"
            >
              Creer compte
            </button>
          </div>

          <br />

          <span>
            Avez-vous un compte?{" "}
            <Link to="/login" className="text-bold">
              {" "}
              Se connecter
            </Link>
          </span>
          <br />
          <br />
          <span>
            <Link
              to="/"
              className="text-bold"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              {" "}
              Retour a la page d'accueil
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
