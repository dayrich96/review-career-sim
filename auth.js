const express = require('express');
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

const dbConfig = {
  user: 'postgres', 
  password: 'Richday@9675', 
  host: 'localhost',
  port: 5432,
  database: 'Review_db' 
};

const client = new Client(dbConfig);

client.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL database using Client');
  }
});

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please provide username, email, and password.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  try {
    const checkUserQuery = 'SELECT id FROM users WHERE username = $1 OR email = $2';
    const userCheckResult = await client.query(checkUserQuery, [username, email]);

    if (userCheckResult.rows.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email';
    const newUserResult = await client.query(insertUserQuery, [username, email, hashedPassword]);

    const newUser = newUserResult.rows[0];
    return res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, username: newUser.username, email: newUser.email } });

  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

router.post('/login', async (req, res) => {
  const { identifier, password } = req.body; 

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Please provide username/email and password.' });
  }

  try {
    
    const findUserQuery = 'SELECT id, username, email, password FROM users WHERE username = $1 OR email = $1';
    const userResult = await client.query(findUserQuery, [identifier]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      
      const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' }); 
      return res.status(200).json({ message: 'Login successful', token: token });
    } else {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

module.exports = router;