// init-db.js
const { sequelize } = require("./models");

sequelize
  .sync() // Pas de force, pas d'alter
  .then(() => {
    console.log("✅ Tables créées avec succès.");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Erreur de synchronisation :", err);
    process.exit(1);
  });
