require('dotenv').config();  // Carga las variables de entorno desde .env
const express = require('express');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config(); // Cargar variables de entorno

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false } // Para permitir conexiones seguras
});

pool.connect()
  .then(() => console.log("✅ Conexión exitosa a la base de datos"))
  .catch(err => console.error("❌ Error al conectar con la base de datos:", err));
    

app.use(cors());
app.use(express.json());

// Endpoint de prueba para verificar la API
app.get('/', (req, res) => {
    res.send('API funcionando con PostgreSQL');
});

// Endpoint para obtener datos de la base de datos
app.get('/api/usuarios', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM usuarios");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
