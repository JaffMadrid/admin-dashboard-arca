const express = require("express");
const app = express();
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/authentication", require("./routes/jwtAuth"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/ai", require("./routes/ai"));

// Root route
app.get("/", (req, res) => {
    res.json({ 
        message: "Backend API is running",
        status: "OK"
    });
});

// Midleware para errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Para Vercel
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Export para Vercel
module.exports = app;