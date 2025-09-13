import express from 'express';
import pkg from 'pg';
import cors from 'cors';
const { Pool } = pkg;
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(limiter);
app.use(helmet());
app.use(express.static('public'));

// CREATE
app.post('/items', async (req, res) => {
  const { name } = req.body;
  const result = await pool.query(
    'INSERT INTO items(name) VALUES($1) RETURNING *',
    [name]
  );
  res.json(result.rows[0]);
});

// READ
app.get('/items', async (req, res) => {
  const result = await pool.query('SELECT * FROM items');
  res.json(result.rows);
});

// UPDATE
app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await pool.query(
    'UPDATE items SET name=$1 WHERE id=$2 RETURNING *',
    [name, id]
  );
  res.json(result.rows[0]);
});

// DELETE
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM items WHERE id=$1', [id]);
  res.sendStatus(204);
});

app.listen(3002, () => {
  console.log('Backend running on http://localhost:3002');
});
<link rel="stylesheet" href="output.css">