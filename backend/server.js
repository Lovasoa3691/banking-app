const express = require("express");
const sequelize = require("./config/db");
// const { getAll } = require("../controllers/UtilisateurController");
const utilisateurRoutes = require("./routes/utilisateurRoutes");
const operationRoutes = require("./routes/operationRoutes");
const app = express();
const port = 5000;
const cors = require("cors");
const session = require("express-session");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: "orion@3691",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use("/api/utilisateurs", utilisateurRoutes);
app.use("/api/operations", operationRoutes);


app.listen(port, () => {
  console.log(`Serveur en ligne sur http://localhost:${port}`);
});
