const request = require('supertest');
const app = require('./server'); 
const { Client } = require('pg');

const dbConfig = {
  user: 'postgres',
  password: 'Richday@9675', 
  host: 'localhost',
  port: 5432,
  database: 'Review_db'
};

describe('API Endpoints', () => {
  let client;

  beforeAll(async () => {
    client = new Client(dbConfig);
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  describe('/api/auth', () => {
    it('should respond with 201 for POST /api/auth/register', async () => {
      const response = await request(app).post('/api/auth/register');
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('User registration endpoint hit');
    });

    it('should respond with 200 for POST /api/auth/login', async () => {
      const response = await request(app).post('/api/auth/login');
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('User login endpoint hit');
    });

    it('should respond with 401 for GET /api/auth/me', async () => {
      const response = await request(app).get('/api/auth/me');
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Not authenticated (placeholder)');
    });
  });

  describe('/api/items', () => {
    it('should respond with 200 for GET /api/items', async () => {
      const response = await request(app).get('/api/items');
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Get all items endpoint hit');
    });

    it('should respond with 200 for GET /api/items/:itemId', async () => {
      const itemId = 1; 
      const response = await request(app).get(`/api/items/${itemId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe(`Get item with ID ${itemId} endpoint hit`);
    });

    it('should respond with 200 for GET /api/items/:itemId/reviews', async () => {
      const itemId = 1; 
      const response = await request(app).get(`/api/items/${itemId}/reviews`);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe(`Get reviews for item ID ${itemId} endpoint hit`);
    });
  });

 
});