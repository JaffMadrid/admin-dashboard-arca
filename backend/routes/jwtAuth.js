const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validInfo = require("../middleware/validInfo.js");
const jwtGenerator = require("../utils/jwtGenerator.js");
const authorize = require("../middleware/authorize");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

//authorizeentication
router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [email]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Generate reset token
    const token = crypto.randomBytes(20).toString('hex');
    
    // Save token in database
    await pool.query(
      "INSERT INTO restablecer_contrasena (id_usuario, token) VALUES ($1, $2)",
      [user.rows[0].id_usuario, token]
    );

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Reset password link
    const resetLink = `admin-dashboard-arca.vercel.app/change-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Restablecimiento de Contraseña',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                font-family: Arial, sans-serif;
                color: #333333;
              }
              .header {
                background-color: #4F46E5;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .header h2 {
                color: white;
                margin: 0;
                font-size: 24px;
              }
              .content {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 0 0 8px 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #4F46E5;
                color: white !important;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: bold;
              }
              .footer {
                margin-top: 20px;
                text-align: center;
                color: #666666;
                font-size: 12px;
              }
              .warning {
                color: #666666;
                font-size: 14px;
                margin-top: 20px;
                padding: 10px;
                border: 1px solid #dddddd;
                border-radius: 4px;
                background-color: #f9f9f9;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Restablecimiento de Contraseña</h2>
              </div>
              <div class="content">
                <p>Hola ${user.rows[0].nombre},</p>
                <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
                <p>Para continuar con el proceso, por favor haz clic en el siguiente botón:</p>
                
                <center>
                  <a href="${resetLink}" class="button">Restablecer Contraseña</a>
                </center>
                
                <div class="warning">
                  <p>⚠️ Este enlace expirará en 1 hora por motivos de seguridad.</p>
                  <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                </div>
              </div>
              <div class="footer">
                <p>Este es un correo automático, por favor no responder.</p>
                <p>&copy; ${new Date().getFullYear()} Arca Reciclaje. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    res.json({ message: "Correo de restablecimiento enviado" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error del servidor" });
  }
});

router.post("/change-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Verify token and check if it's not used
    const resetRequest = await pool.query(
      "SELECT * FROM restablecer_contrasena WHERE token = $1 AND utilizado = false AND fecha_solicitud > NOW() - INTERVAL '1 hour'",
      [token]
    );

    if (resetRequest.rows.length === 0) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // Hash new password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await pool.query(
      "UPDATE usuarios SET contrasena = $1 WHERE id_usuario = $2",
      [bcryptPassword, resetRequest.rows[0].id_usuario]
    );

    // Mark token as used
    await pool.query(
      "UPDATE restablecer_contrasena SET utilizado = true WHERE token = $1",
      [token]
    );

    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error del servidor" });
  }
});

router.post("/login", validInfo, async (req, res) => {
  const { user, password } = req.body;

  try {
    const users = await pool.query("SELECT * FROM usuarios WHERE usuario = $1 AND estado_usuario = true", [
      user
    ]);

    if (users.rows.length === 0) {
      return res.status(401).json("Credenciales Invalidas");
    }

    const validPassword = await bcrypt.compare(
      password,
      users.rows[0].contrasena
    );

    if (!validPassword) {
      return res.status(401).json("Credenciales Invalidas");
    }
    const jwtToken = jwtGenerator(users.rows[0].id_auth);
    const userRole = users.rows[0].id_rol;

    return res.json({ jwtToken,userRole});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor!");
  }
});

router.get("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error de Servidor!");
  }
});

module.exports = router;