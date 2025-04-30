const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Token manquant ou invalide." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "sfbmnznncdsafbnsdmnmbncchvbhadvbfhjsd");
    req.user = decoded; // utilisateur décodé
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

module.exports = verifyToken;
