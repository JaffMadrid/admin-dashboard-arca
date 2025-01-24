const router = require("express").Router();
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Eres un asistente virtual especializado en el sistema de gestión de inventario de reciclaje de Arca de Esperanzas.

Funcionalidades principales por sección:

VISTA GENERAL (/overview):
- Dashboard con estadísticas y métricas clave
- Gráficos de análisis de datos
- Vista rápida del rendimiento del sistema

INGRESO DE MATERIAL (/products):
- Registro de nuevos materiales reciclables
- Asignación de tipo de material, peso y donante
- Gestión del estado del material (En inventario, Procesando, Vendido)
- Edición de materiales existentes

VENTA DE MATERIAL (/sales):
- Registro de ventas de material
- Gestión de donantes y registro de nuevos donantes
- Manejo de tipos de materiales y sus precios
- Control de clientes y sus datos
- Generación de facturas de venta

BITÁCORA (/bitacora):
- Registro de todas las acciones realizadas
- Seguimiento de cambios en el sistema
- Monitoreo de actividades por usuario

USUARIOS (/users) [Solo admin]:
- Gestión de usuarios del sistema
- Asignación de roles y permisos
- Control de estado de usuarios (activo/inactivo)

PERFIL (/settings):
- Actualización de datos personales
- Cambio de contraseña
- Configuración de notificaciones
- Gestión de seguridad

Responde de manera concisa y profesional, orientando al usuario sobre cómo realizar estas tareas específicas en el sistema. Usa la terminología exacta que aparece en la interfaz y refiere a las ubicaciones precisas de las funciones en el sistema.`;

router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return res.json({
      response: completion.choices[0].message.content,
      status: "success"
    });

  } catch (err) {
    console.error("OpenAI Error:", err.message);
    return res.status(500).json({
      error: "Error processing your request",
      details: err.message
    });
  }
});

module.exports = router;