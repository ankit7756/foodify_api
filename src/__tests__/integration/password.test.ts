import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../models/User.model';

describe('Password Reset Integration Tests', () => {
    const testUser = {
        username: 'resetuser',
        email: 'reset@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        fullName: 'Reset User',
        phone: '6666666666'
    };

    beforeAll(async () => {
        await UserModel.deleteMany({ email: testUser.email });
        await request(app).post('/api/auth/register').send(testUser);
    });

    afterAll(async () => {
        await UserModel.deleteMany({ email: testUser.email });
    });

    describe('POST /api/auth/request-password-reset', () => {
        test('should request password reset', async () => {
            const response = await request(app)
                .post('/api/auth/request-password-reset')
                .send({ email: testUser.email });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
        });

        test('should handle non-existent email', async () => {
            const response = await request(app)
                .post('/api/auth/request-password-reset')
                .send({ email: 'nonexistent@test.com' });

            expect(response.status).toBe(404);
        });
    });
});