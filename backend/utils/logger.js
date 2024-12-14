const pool = require("../db");

const logActivity = async (userId, action, table, details) => {
  try {
    
    await pool.query(
      "INSERT INTO bitacora (id_auth, accion, tabla_afectada, detalles) VALUES ($1, $2, $3, $4)",
      [userId, action, table, JSON.stringify(details)]
    );
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

module.exports = { logActivity };