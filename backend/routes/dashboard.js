const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../db");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;


router.get("/profile", authorize, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id_usuario, nombre, correo, id_rol, imagen_url FROM usuarios WHERE id_auth = $1",
      [req.user.id] 
    ); 
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

router.post("/change-password", authorize, async (req, res) => {
  try {
    const {currentPassword, newPassword} = req.body;
    const user = await pool.query("SELECT * FROM usuarios WHERE id_auth = $1", [req.user.id]);

    if (user.rows.length === 0) {
      return res.status(404).json("Usuario no encontrado");
    }

    const validPassword = await bcrypt.compare(currentPassword, user.rows[0].contrasena);

    if (!validPassword) {
      return res.status(401).json("Contraseña actual incorrecta");
    }
    
    const bcryptPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await pool.query(
      "UPDATE usuarios SET contrasena = $1 WHERE id_auth = $2",
      [bcryptPassword,req.user.id]
    );

    res.json("Contraseña actualizada correctamente");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor!");
  }
});

router.patch("/update-profile", authorize, async (req, res) => {
  try {
    const { nombre, correo, imagen_url } = req.body;
    
    const result = await pool.query(
      "UPDATE usuarios SET nombre = $1, correo = $2, imagen_url = $3 WHERE id_auth = $4 RETURNING *",
      [nombre, correo, imagen_url, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json("Usuario no encontrado");
    }

    res.json("Perfil actualizado correctamente");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor!");
  }
});

router.get("/userInfo", async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT u.id_usuario, u.nombre, u.correo, u.usuario, u.id_rol, u.estado_usuario, u.fecha_creacion, r.nombre_rol FROM Usuarios u JOIN Roles r ON u.id_rol = r.id_rol ORDER BY u.id_usuario ASC"); 
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
      "SELECT id_tipo_material, descripcion_tipo, precioLibra FROM tipos_materiales ORDER BY id_tipo_material ASC"
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
      "SELECT id_estado_material, descripcion_estado FROM estados_materiales WHERE id_estado_material IN (1, 3);"
    ); 
    res.json(estadosMaterial.rows); // Devuelve los roles como respuesta en formato JSON
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

router.get("/clientes", async (req, res) => {
  try {
    const cliente = await pool.query(
      "SELECT id_cliente, nombre_cliente, telefono_cliente, direccion_cliente FROM clientes"
    ); 
    res.json(cliente.rows); // Devuelve los roles como respuesta en formato JSON
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

router.patch("/updateTipo/:id", async (req, res) => {
  const { id } = req.params; // Obtiene el ID del tipo material de los parámetros
  const { descripcion_tipo, preciolibra } = req.body; // Obtiene los datos del cuerpo de la solicitud
  try {
    // Actualiza la información de tipo de material en la base de datos
    const result = await pool.query(
      "UPDATE tipos_materiales SET descripcion_tipo = $1, preciolibra = $2 WHERE id_tipo_material = $3 RETURNING *",
      [descripcion_tipo, preciolibra, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Tipo material no encontrado");
    }

    res.json({ message: "Tipo material actualizado", tipo: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

router.patch("/updateDonante/:id", async (req, res) => {
  const { id } = req.params; // Obtiene el ID del tipo material de los parámetros
  const { nombre_donante, telefono, direccion } = req.body; // Obtiene los datos del cuerpo de la solicitud
  try {
    // Actualiza la información de tipo de material en la base de datos
    const result = await pool.query(
      "UPDATE donantes SET nombre_donante = $1, telefono = $2, direccion = $3 WHERE id_donante = $4 RETURNING *",
      [nombre_donante, telefono, direccion, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Donante no encontrado");
    }

    res.json({ message: "Donante actualizado", donante: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});


router.patch("/updateCliente/:id", async (req, res) => {
  const { id } = req.params; // Obtiene el ID del Cliente de los parámetros
  const { nombre_cliente, telefono_cliente, direccion_cliente } = req.body; // Obtiene los datos del cuerpo de la solicitud
  try {
    // Actualiza la información de Cliente en la base de datos
    const result = await pool.query(
      "UPDATE clientes SET nombre_cliente = $1, telefono_cliente = $2, direccion_cliente = $3 WHERE id_cliente = $4 RETURNING *",
      [nombre_cliente, telefono_cliente, direccion_cliente, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Cliente no encontrado");
    }

    res.json({ message: "Cliente actualizado", cliente: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});



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

router.post("/createTipoMaterial", async (req, res) => {
  try {
    const {descripcion_tipo, preciolibra} = req.body;

    // Validación simple de los datos recibidos
    if (!descripcion_tipo || !preciolibra) {
      return res.status(400).json({ error: "Por favor, completa todos los campos requeridos." });
    }

    // Inserta el nuevo usuario en la base de datos
    const newTipoMaterial = await pool.query(
      "INSERT INTO tipos_materiales (descripcion_tipo, preciolibra) VALUES ($1, $2) RETURNING *",
      [descripcion_tipo, preciolibra]
    );

    // Responde con el material recién creado 
    res.status(201).json({
      id_tipo_material: newTipoMaterial.rows[0].id_tipo_material,
      descripcion_tipo: newTipoMaterial.rows[0].descripcion_tipo,
      preciolibra: newTipoMaterial.rows[0].preciolibra
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

router.post("/createDonante", async (req, res) => {
  try {
    const {nombre_donante, telefono, direccion } = req.body;

    // Validación simple de los datos recibidos
    if (!nombre_donante || !telefono || !direccion) {
      return res.status(400).json({ error: "Por favor, completa todos los campos requeridos." });
    }

    // Inserta el nuevo usuario en la base de datos
    const newDonante = await pool.query(
      "INSERT INTO donantes (nombre_donante, telefono, direccion) VALUES ($1, $2, $3) RETURNING *",
      [nombre_donante, telefono, direccion]
    );

    // Responde con el material recién creado 
    res.status(201).json({
      id_donante: newDonante.rows[0].id_donante,
      nombre_donante: newDonante.rows[0].nombre_donante,
      telefono: newDonante.rows[0].telefono,
      direccion: newDonante.rows[0].direccion
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

router.post("/createCliente", async (req, res) => {
  try {
    const {nombre_cliente, telefono_cliente, direccion_cliente } = req.body;

    // Validación simple de los datos recibidos
    if (!nombre_cliente || !telefono_cliente || !direccion_cliente) {
      return res.status(400).json({ error: "Por favor, completa todos los campos requeridos." });
    }

    // Inserta el nuevo usuario en la base de datos
    const newCliente = await pool.query(
      "INSERT INTO clientes (nombre_cliente, telefono_cliente, direccion_cliente) VALUES ($1, $2, $3) RETURNING *",
      [nombre_cliente, telefono_cliente, direccion_cliente ]
    );

    // Responde con el material recién creado 
    res.status(201).json({
      id_cliente: newCliente.rows[0].id_cliente,
      nombre_cliente: newCliente.rows[0].nombre_cliente,
      telefono_cliente: newCliente.rows[0].telefono_cliente,
      direccion_cliente: newCliente.rows[0].direccion_cliente
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
       JOIN tipos_materiales tm ON m.id_tipo_material = tm.id_tipo_material
       ORDER BY m.id_material DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener materiales:", err);
    res.status(500).send("Error del servidor");
  }
});

router.get("/materialesForSaleTable", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT    
    m.id_tipo_material,
    tm.descripcion_tipo,
    SUM(m.peso) AS peso_total
    FROM 
        Materiales m
    JOIN 
        tipos_materiales tm ON m.id_tipo_material = tm.id_tipo_material
    WHERE 
        m.id_estado_material = 1
    GROUP BY 
        m.id_tipo_material, tm.descripcion_tipo
    ORDER BY m.id_tipo_material ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener materiales:", err);
    res.status(500).send("Error del servidor");
  }
});

router.get("/materialesForSale", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
    id_material,     
    id_tipo_material
    FROM 
        Materiales 
    WHERE 
        id_estado_material = 1`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener materiales:", err);
    res.status(500).send("Error del servidor");
  }
});

router.post("/venderMateriales", async (req, res) => {
  try {
    const { materiales } = req.body; // Recibir un arreglo de id_material
    if (!materiales || materiales.length === 0) {
      return res.status(400).send("No se proporcionaron materiales para vender.");
    }
    
    // Actualizar el estado de los materiales seleccionados
    const query = `
      UPDATE materiales 
      SET id_estado_material = 2 
      WHERE id_material = ANY($1)
    `;
    await pool.query(query, [materiales]);

    res.status(200).send("Materiales vendidos exitosamente.");
  } catch (err) {
    console.error("Error al vender materiales:", err);
    res.status(500).send("Error del servidor.");
  }
});

router.post("/createVenta", async (req, res) => {
  try {
    const { id_cliente, total } = req.body;

    // Validation 
    if (!id_cliente || !total) {
      return res.status(400).json({ error: "Por favor, proporcione el cliente y el total de la venta." });
    }

    // Insert into Ventas table
    const newVenta = await pool.query(
      "INSERT INTO Ventas (id_cliente, total) VALUES ($1, $2) RETURNING *",
      [id_cliente, total]
    );

    // Return the created sale
    res.status(201).json({
      id_venta: newVenta.rows[0].id_venta,
      id_cliente: newVenta.rows[0].id_cliente, 
      fecha_venta: newVenta.rows[0].fecha_venta,
      total: newVenta.rows[0].total
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

router.get("/lastVenta", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_venta FROM Ventas ORDER BY id_venta DESC LIMIT 1"
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

router.post("/createDetalleVenta", async (req, res) => {
  try {
    const { id_venta, materiales } = req.body;

    if (!id_venta || !materiales || materiales.length === 0) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    // Insert multiple records into detalle_ventas
    const values = materiales.map(id_material => `(${id_venta}, ${id_material})`).join(',');
    const query = `
      INSERT INTO Detalle_Ventas (id_venta, id_material) 
      VALUES ${values}
      RETURNING *
    `;
    
    const result = await pool.query(query);
    res.status(201).json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor");
  }
});

router.get("/ventas", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT v.id_venta, v.fecha_venta, v.total, c.nombre_cliente
       FROM Ventas v
       JOIN Clientes c ON v.id_cliente = c.id_cliente
       ORDER BY v.fecha_venta DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener ventas:", err);
    res.status(500).send("Error del servidor");
  }
});


module.exports = router;