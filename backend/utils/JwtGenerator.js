const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(id_auth) {
  const payload = {
    user: {
      id: id_auth
    }
  };
  

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });
}

module.exports = jwtGenerator;