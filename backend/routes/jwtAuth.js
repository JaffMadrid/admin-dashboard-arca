const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validInfo = require("../middleware/validInfo.js");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authorize");

//authorizeentication

router.post("/register", validInfo, async (req, res) => {
  const { name, email, user, password, role, } = req.body;

  try {
    const users = await pool.query("SELECT * FROM usuarios WHERE usuario = $1", [
      user
    ]);

    if (users.rows.length > 0) {
      return res.status(401).json("User already exist!");
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let newUser = await pool.query(
      "INSERT INTO usuarios (nombre, correo, usuario, contrasena, id_rol) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, user, bcryptPassword, role]
    );

    const jwtToken = jwtGenerator(newUser.rows[0].id_auth);

    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", validInfo, async (req, res) => {
  const { user, password } = req.body;

  try {
    const users = await pool.query("SELECT * FROM usuarios WHERE usuario = $1", [
      user
    ]);

    if (users.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    const validPassword = await bcrypt.compare(
      password,
      users.rows[0].contrasena
    );

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }
    const jwtToken = jwtGenerator(users.rows[0].id_auth);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;