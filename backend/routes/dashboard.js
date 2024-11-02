const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../db");


router.get("/profile", authorize, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT nombre, correo FROM usuarios WHERE id_auth = $1",
      [req.user.id] 
    ); 
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

module.exports = router;


router.get("/userInfo", async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT u.id_usuario, u.nombre, u.correo, u.usuario, u.id_rol, u.estado_usuario, u.fecha_creacion, r.nombre_rol FROM Usuarios u JOIN Roles r ON u.id_rol = r.id_rol"); 
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

router.get("/roles", async (req, res) => {
  try {
    const roles = await pool.query(
      "SELECT id_rol, nombre_rol FROM Roles"
    ); 
    res.json(roles.rows); // Devuelve los roles como respuesta en formato JSON
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

router.patch("/banUser/:id", async (req, res) => {
  const { id } = req.params; // Obtiene el ID del usuario de los parámetros
  try {
    // Actualiza el estado del usuario a inactivo
    const result = await pool.query(
      "UPDATE Usuarios SET estado_usuario = false WHERE id_usuario = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Usuario no encontrado");
    }

    res.json({ message: "Usuario desactivado", usuario: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

router.patch("/updateUser/:id", async (req, res) => {
  const { id } = req.params; // Obtiene el ID del usuario de los parámetros
  const { nombre, correo, usuario, id_rol, estado_usuario } = req.body; // Obtiene los datos del cuerpo de la solicitud
  try {
    // Actualiza la información del usuario en la base de datos
    const result = await pool.query(
      "UPDATE Usuarios SET nombre = $1, correo = $2, usuario = $3, id_rol = $4, estado_usuario = $5 WHERE id_usuario = $6 RETURNING *",
      [nombre, correo, usuario, id_rol, estado_usuario, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Usuario no encontrado");
    }

    res.json({ message: "Usuario actualizado", usuario: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

router.post("/createUser", async (req, res) => {
  try {
    const { nombre, correo, usuario, id_rol, estado_usuario, contrasena } = req.body;

    // Validación simple de los datos recibidos (opcional)
    if (!nombre || !correo || !usuario || !id_rol || !contrasena) {
      return res.status(400).json({ error: "Por favor, completa todos los campos requeridos." });
    }

    // Encriptar la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(contrasena, SALT_ROUNDS);

    // Inserta el nuevo usuario en la base de datos
    const newUser = await pool.query(
      "INSERT INTO Usuarios (nombre, correo, usuario, contrasena, id_rol, estado_usuario, fecha_creacion) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *",
      [nombre, correo, usuario,hashedPassword, id_rol, estado_usuario]
    );

    // Responde con el usuario recién creado (sin incluir la contraseña)
    res.status(201).json({
      id_usuario: newUser.rows[0].id_usuario,
      nombre: newUser.rows[0].nombre,
      correo: newUser.rows[0].correo,
      usuario: newUser.rows[0].usuario,
      id_rol: newUser.rows[0].id_rol,
      estado_usuario: newUser.rows[0].estado_usuario,
      fecha_creacion: newUser.rows[0].fecha_creacion
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

module.exports = router;