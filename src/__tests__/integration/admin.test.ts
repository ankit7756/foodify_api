import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../models/User.model';

describe('Admin Users Integration Tests', () => {
    let adminToken: string;
    let userToken: string;
    let testUserId: string;

    const adminUser = {
        username: 'admin',
        email: 'admin@test.com',
        password: 'Admin123!',
        confirmPassword: 'Admin123!',
        fullName: 'Admin User',
        phone: '9999999999',
        role: 'admin'
    };

    const regularUser = {
        username: 'regularuser',
        email: 'user@test.com',
        password: 'User123!',
        confirmPassword: 'User123!',
        fullName: 'Regular User',
        phone: '8888888888'
    };

    beforeAll(async () => {
        // Clean up
        await UserModel.deleteMany({
            email: { $in: [adminUser.email, regularUser.email] }
        });

        // Create admin
        const adminRes = await request(app)
            .post('/api/auth/register')
            .send(adminUser);

        // Manually set role to admin
        await UserModel.findOneAndUpdate(
            { email: adminUser.email },
            { role: 'admin' }
        );

        // Login admin
        const adminLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: adminUser.email,
                password: adminUser.password
            });

        adminToken = adminLogin.body.token;

        // Create regular user
        await request(app)
            .post('/api/auth/register')
            .send(regularUser);

        // Login regular user
        const userLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: regularUser.email,
                password: regularUser.password
            });

        userToken = userLogin.body.token;
    });

    afterAll(async () => {
        await UserModel.deleteMany({
            email: { $in: [adminUser.email, regularUser.email, 'created@test.com'] }
        });
    });

    describe('GET /api/admin/users', () => {
        test('should get all users as admin', async () => {
            const response = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('pagination');
        });

        test('should not get users without token', async () => {
            const response = await request(app)
                .get('/api/admin/users');

            expect(response.status).toBe(401);
        });

        test('should not get users as regular user', async () => {
            const response = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(403);
        });

        test('should support pagination', async () => {
            const response = await request(app)
                .get('/api/admin/users?page=1&size=5')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.pagination.page).toBe(1);
            expect(response.body.pagination.size).toBe(5);
        });

        test('should support search', async () => {
            const response = await request(app)
                .get('/api/admin/users?search=admin')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('POST /api/admin/users', () => {
        test('should create user as admin', async () => {
            const newUser = {
                username: 'createduser',
                email: 'created@test.com',
                password: 'Created123!',
                confirmPassword: 'Created123!',
                fullName: 'Created User',
                phone: '7777777777'
            };

            const response = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('success', true);
            testUserId = response.body.data._id;
        });

        test('should not create user as regular user', async () => {
            const response = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${userToken}`)
                .send({});

            expect(response.status).toBe(403);
        });
    });

    describe('GET /api/admin/users/:id', () => {
        test('should get single user as admin', async () => {
            const response = await request(app)
                .get(`/api/admin/users/${testUserId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.email).toBe('created@test.com');
        });

        test('should not get user with invalid ID', async () => {
            const response = await request(app)
                .get('/api/admin/users/invalid-id')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(500);
        });
    });

    describe('PUT /api/admin/users/:id', () => {
        test('should update user as admin', async () => {
            const response = await request(app)
                .put(`/api/admin/users/${testUserId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ fullName: 'Updated Name' });

            expect(response.status).toBe(200);
            expect(response.body.data.fullName).toBe('Updated Name');
        });
    });

    describe('DELETE /api/admin/users/:id', () => {
        test('should delete user as admin', async () => {
            const response = await request(app)
                .delete(`/api/admin/users/${testUserId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
        });

        test('should not delete non-existent user', async () => {
            const response = await request(app)
                .delete(`/api/admin/users/${testUserId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(404);
        });
    });
});