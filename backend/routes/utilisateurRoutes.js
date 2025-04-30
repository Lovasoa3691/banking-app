const express = require("express");
const router = express.Router();
const controller = require("../controllers/UtilisateurController");
const verifyToken = require("../middlewire/middlewire");

router.get("/", verifyToken, controller.getClientById);
router.get("/client", controller.getAllClient);
router.get("/compte", controller.getAllCompte);
router.get("/me", verifyToken, controller.getUserConnected);
router.post("/", verifyToken, controller.create);
router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/logout", controller.logout);
router.post("/client", verifyToken, controller.createClient);
// router.put("/:id", controller.update);
// router.delete("/:id", controller.delete);

module.exports = router;
