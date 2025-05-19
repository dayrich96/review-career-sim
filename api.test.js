const request = require('supertest');
const app = require('./server'); 
const { Client } = require('pg');
const bcrypt = require('bcrypt');

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
    
    await client.query('DELETE FROM users WHERE username LIKE \'testuser%\' OR email LIKE \'test@example%\'');
  });

  afterAll(async () => {
    await client.query('DELETE FROM users WHERE username LIKE \'testuser%\' OR email LIKE \'test@example%\'');
    await client.end();
  });

  describe('/api/auth/register', () => {
    it('should respond with 201 for successful user registration', async () => {
      const newUser = {
        username: 'testuser1',
        email: 'test1@example.com',
        password: 'password123',
      };
      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.username).toBe(newUser.username);
      expect(response.body.user.email).toBe(newUser.email);
    });

    it('should respond with 400 for missing required fields', async () => {
      const incompleteUser = {
        username: 'testuser2',
        email: 'test2@example.com',
      };
      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteUser);
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Please provide username, email, and password.');
    });

    it('should respond with 400 for invalid email format', async () => {
      const invalidEmailUser = {
        username: 'testuser3',
        email: 'invalid-email',
        password: 'password123',
      };
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidEmailUser);
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Invalid email format.');
    });

    it('should respond with 409 for existing username', async () => {
      
      const existingUser = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
      };
      await request(app)
        .post('/api/auth/register')
        .send(existingUser);

      
      const duplicateUser = {
        username: 'existinguser',
        email: 'new@example.com',
        password: 'anotherpassword',
      };
      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateUser);
      expect(response.statusCode).toBe(409);
      expect(response.body.error).toBe('Username or email already exists.');
    });

    it('should respond with 409 for existing email', async () => {
      
      const existingUser = {
        username: 'anotheruser',
        email: 'existing@example.com',
        password: 'password123',
      };
      await request(app)
        .post('/api/auth/register')
        .send(existingUser);

      
      const duplicateUser = {
        username: 'newuser',
        email: 'existing@example.com',
        password: 'anotherpassword',
      };
      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateUser);
      expect(response.statusCode).toBe(409);
      expect(response.body.error).toBe('Username or email already exists.');
    });
  });

});