import bodyParser from "body-parser"
import cors from "cors"
import dotenv from 'dotenv'
import express from "express"
import pg from "pg"
import { products } from './products.js'

dotenv.config()

// Validate required environment variables
if (!process.env.CONN) {
    console.error('Error: Database connection string (CONN) is not defined in environment variables')
    process.exit(1)
}

const app = express();
// Configure CORS for React application
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

const conString = process.env.CONN;
const { Client } = pg;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/ping", (req, res) => {
    res.send(new Date().toISOString());

});
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/api/products", (req, res) => {
    res.json(products);
});

app.get("/sql", async (req, res) => {
    const client = new Client(conString);
    try {
        await client.connect()
        const filas = await client.query(req.query.sql, [])
        res.json(filas.rows);
    } catch (error) {
        console.error('Database error:', error)
        res.status(500).json({ error: 'Database operation failed' })
    } finally {
        await client.end()
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`)
    console.log('CORS enabled for React application at http://localhost:5173')
});