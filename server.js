const express = require('express');
const authRoutes = require('./auth'); // Import the auth.js router
const { Client } = require('pg');

const app = express();
const port = 3000;

app.use(express.json());


app.use('/api/auth', authRoutes); 


app.get('/api/items', (req, res) => {
    res.status(200).json({ message: 'Get all items endpoint hit' });
});

app.get('/api/items/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    res.status(200).json({ message: `Get item with ID ${itemId} endpoint hit` });
});

app.get('/api/items/:itemId/reviews', (req, res) => {
    const itemId = req.params.itemId;
    res.status(200).json({ message: `Get reviews for item ID ${itemId} endpoint hit` });
});


app.get('/api/items/:itemId/reviews/:reviewId', (req, res) => {
    const { itemId, reviewId } = req.params;
    res.status(200).json({ message: `Get review ${reviewId} for item ${itemId} endpoint hit` });
});

app.post('/api/items/:itemId/reviews', (req, res) => {
    res.status(401).json({ error: 'Authentication required to post a review (placeholder)' });
});

app.get('/api/reviews/me', (req, res) => {
    res.status(401).json({ error: 'Not authenticated (placeholder)' });
});

app.put('/api/users/:userId/reviews/:reviewId', (req, res) => {
    const { userId, reviewId } = req.params;
    res.status(401).json({ error: `Authentication required to edit review ${reviewId} for user ${userId} (placeholder)` });
});


app.post('/api/items/:itemId/reviews/:reviewId/comments', (req, res) => {
    const { itemId, reviewId } = req.params;
    res.status(401).json({ error: `Authentication required to comment on review ${reviewId} for item ${itemId} (placeholder)` });
});

app.get('/api/comments/me', (req, res) => {
    res.status(401).json({ error: 'Not authenticated (placeholder)' });
});

app.put('/api/users/:userId/comments/:commentId', (req, res) => {
    const { userId, commentId } = req.params;
    res.status(401).json({ error: `Authentication required to edit comment ${commentId} for user ${userId} (placeholder)` });
});

app.delete('/api/users/:userId/comments/:commentId', (req, res) => {
    const { userId, commentId } = req.params;
    res.status(401).json({ error: `Authentication required to delete comment ${commentId} for user ${userId} (placeholder)` });
});

app.delete('/api/users/:userId/reviews/:reviewId', (req, res) => {
    const { userId, reviewId } = req.params;
    res.status(401).json({ error: `Authentication required to delete review ${reviewId} for user ${userId} (placeholder)` });
});


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


module.exports = app;


if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}