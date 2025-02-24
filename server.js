const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Koneksi PostgreSQL
const pool = new Pool({
  user: 'postgres', // Ganti dengan username PostgreSQL Anda
  host: 'localhost',
  database: 'pawon_db', // Ganti dengan nama database Anda
  password: 'zultiandra123', // Ganti dengan password PostgreSQL Anda
  port: 5432,
});

// Cek koneksi database
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error:', err.stack));

// Endpoint Registrasi User
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validasi input
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Simpan data ke database
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
    [username, email, hashedPassword]
    );
    res.status(201).json({
      message: 'User registered successfully',
      userId: result.rows[0].id,
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
