const router = require("express").Router();
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Eres un asistente virtual para el sistema de gestión de inventario de reciclaje de Arca de Esperanzas. 
Puedes ayudar con:
- Ingreso de material
- Venta de material
- Donaciones
- Consulta de inventario
- Análisis de datos
- Generación de reportes
- Gestión de usuarios

Responde de manera concisa y profesional, orientando al usuario sobre cómo realizar estas tareas en el sistema.`;

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