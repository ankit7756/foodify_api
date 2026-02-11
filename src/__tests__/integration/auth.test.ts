import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../models/User.model';

describe('Auth Integration Tests', () => {
    const testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        fullName: 'Test User',
        phone: '1234567890'
    };

    beforeAll(async () => {
        await UserModel.deleteMany({
            $or: [{ email: testUser.email }, { username: testUser.username }]
        });
    });

    afterAll(async () => {
        await UserModel.deleteMany({
            $or: [{ email: testUser.email }, { username: testUser.username }]
        });
    });

    describe('POST /api/auth/register', () => {
        test('should register a new user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('success', true);
        });

        test('should not register with duplicate email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('success', false);
        });

        test('should not register with duplicate username', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({ ...testUser, email: 'new@email.com' });

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('success', false);
        });
    });

    describe('POST /api/auth/login', () => {
        test('should login existing user', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('token');
        });

        test('should not login with incorrect password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'WrongPassword!'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('success', false);
        });
    });
});