const jwt = require("jsonwebtoken"); // Importa el módulo jsonwebtoken para crear y verificar tokens JWT
require("dotenv").config(); // Carga las variables de entorno desde un archivo .env

// Función para generar un token JWT
function jwtGenerator(id_auth) {
  // Define el payload del token, que contiene la información del usuario
  const payload = {
    user: {
      id: id_auth // ID del usuario que se incluirá en el token
    }
  };
  
  // Firma el token con el payload, una clave secreta y una expiración de 1 hora
  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });
}

module.exports = jwtGenerator; // Exporta la función jwtGenerator para que pueda ser utilizada en otros archivos