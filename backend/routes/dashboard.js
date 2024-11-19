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

router.get("/tipoMateriales", async (req, res) => {
  try {
    const tipoMateriales = await pool.query(
      "SELECT id_tipo_material, descripcion_tipo FROM tipos_materiales"
    ); 
    res.json(tipoMateriales.rows); // Devuelve los roles como respuesta en formato JSON
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

router.get("/donantes", async (req, res) => {
  try {
    const donante = await pool.query(
      "SELECT id_donante, nombre_donante, telefono, direccion FROM Donantes"
    ); 
    res.json(donante.rows); // Devuelve los roles como respuesta en formato JSON
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

router.get("/estadoMateriales", async (req, res) => {
  try {
    const estadosMaterial = await pool.query(
      "SELECT id_estado_material, descripcion_estado FROM estados_materiales"
    ); 
    res.json(estadosMaterial.rows); // Devuelve los roles como respuesta en formato JSON
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

router.patch("/updateMaterial/:id", async (req, res) => {
  const { id } = req.params; // Obtiene el ID del material de los parámetros
  const { id_tipo_material, peso, id_donante, id_estado_material} = req.body; // Obtiene los datos del cuerpo de la solicitud
  try {
    // Actualiza la información del material en la base de datos
    const result = await pool.query(
      "UPDATE materiales SET id_tipo_material = $1, peso = $2, id_donante = $3, id_estado_material = $4 WHERE id_material = $5 RETURNING *",
      [id_tipo_material, peso, id_donante, id_estado_material, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Material no encontrado");
    }

    res.json({ message: "Material actualizado", material: result.rows[0] });
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

router.post("/createMaterial", async (req, res) => {
  try {
    const { id_tipo_material, peso, id_donante, id_estado_material } = req.body;

    // Validación simple de los datos recibidos
    if (!id_tipo_material || !peso || !id_donante || !id_estado_material) {
      return res.status(400).json({ error: "Por favor, completa todos los campos requeridos." });
    }

    // Inserta el nuevo usuario en la base de datos
    const newMaterial = await pool.query(
      "INSERT INTO materiales (id_tipo_material, peso, fecha_ingreso ,id_donante, id_estado_material) VALUES ($1, $2, NOW(), $3, $4) RETURNING *",
      [id_tipo_material, peso, id_donante, id_estado_material]
    );

    // Responde con el material recién creado 
    res.status(201).json({
      id_tipo_material: newMaterial.rows[0].id_tipo_material,
      peso: newMaterial.rows[0].peso,
      fecha_ingreso: newMaterial.rows[0].fecha_ingreso,
      id_donante: newMaterial.rows[0].id_donante,
      id_estado_material: newMaterial.rows[0].id_estado_material
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});


router.get("/materiales", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.id_material, m.id_tipo_material, m.peso, m.fecha_ingreso, m.id_donante, m.id_estado_material,
              d.nombre_donante, e.descripcion_estado,tm.descripcion_tipo
       FROM Materiales m
       JOIN donantes d ON m.id_donante = d.id_donante
       JOIN estados_materiales e ON m.id_estado_material = e.id_estado_material
       JOIN tipos_materiales tm ON m.id_tipo_material = tm.id_tipo_material`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener materiales:", err);
    res.status(500).send("Error del servidor");
  }
});

router.get("/tipomateriales", async (req, res) => {
  try {
    const tipoMaterial = await pool.query(
      "SELECT id_tipo_material, descripcion_tipo FROM tipos_materiales"
    ); 
    res.json(tipoMaterial.rows); // Devuelve los roles como respuesta en formato JSON
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

router.get("/estadoMateriales", async (req, res) => {
  try {
    const estadoMaterial = await pool.query(
      "SELECT id_estado_material, descripcion_estado FROM estado_materiales"
    ); 
    res.json(estadoMaterial.rows); // Devuelve los roles como respuesta en formato JSON
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

router.get("/donantes", async (req, res) => {
  try {
    const donantes = await pool.query(
      "SELECT id_donante, nombre_donante,telefono, direccion FROM donantes"
    ); 
    res.json(donantes.rows); // Devuelve los roles como respuesta en formato JSON
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

module.exports = router;