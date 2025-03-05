require('dotenv').config();  // Carga las variables de entorno desde .env

const express = require('express');
const cors = require('cors');
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// Validación de variables de entorno esenciales
if (!process.env.DB_USER || !process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_PASS || !process.env.DB_PORT) {
    console.error("❌ ERROR: Falta una o más variables de entorno requeridas para la conexión a PostgreSQL.");
    process.exit(1); // Detiene la ejecución del backend si hay un error en la configuración
}

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false } // Para permitir conexiones seguras
});

// Conexión a la base de datos
pool.connect()
    .then(() => console.log("✅ Conexión exitosa a PostgreSQL en AWS RDS"))
    .catch(err => {
        console.error("❌ Error al conectar con PostgreSQL:", err);
        process.exit(1); // Detiene la ejecución si no puede conectarse a la base de datos
    });


// Middleware
app.use(cors({
    origin: ['http://3.86.252.99', 'http://balanceador-docker-670246088.us-east-1.elb.amazonaws.com'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Endpoint de prueba
app.get('/', (req, res) => {
    res.send('API funcionando con PostgreSQL');
});

// Endpoint para obtener datos de la base de datos
app.get('/api/movies', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM movies");
        res.json(result.rows);
    } catch (err) {
        console.error("❌ Error al obtener datos de la base de datos:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});