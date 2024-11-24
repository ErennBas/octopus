import request from 'supertest';

// For other tests.
process.env.PORT = '3005';
process.env.NODE_ENV = 'test';

import server from '../index';
import { IUser } from '../models/user.model';
import { UserService } from '../services/user.service';

describe('User API', () => {
	let testUserId: number;

	beforeAll(async () => {
		await server.startServer();
	});

	describe('POST /register', () => {
		it('should user registered', async () => {
			const res = await request(server.app)
				.post('/register').send({
					email: 'user@test.com',
					password: 'test1234',
					name: 'test user'
				});

			expect(res.status).toBe(201);
			expect(res.body.token).not.toBe(undefined);
			testUserId = (JSON.parse(atob(res.body.token.split('.')[1])) as IUser).id;
		});
	});

	describe('POST /login', () => {
		it('should login', async () => {
			const res = await request(server.app)
				.post('/login').send({
					email: 'user@test.com',
					password: 'test1234'
				});

			expect(res.status).toBe(200);
			expect(res.body.token).not.toBe(undefined);
		});
	});

	describe('POST /register (Register User Validation)', () => {
		it('should return 400 for missing email', async () => {
			const res = await request(server.app)
				.post('/register')
				.send({
					password: 'test1234',
					name: 'test user',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('email should not be empty');
		});

		it('should return 400 for invalid email format', async () => {
			const res = await request(server.app)
				.post('/register')
				.send({
					email: 'invalid-email',
					password: 'test1234',
					name: 'test user',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('email must be an email');
		});

		it('should return 400 for missing password', async () => {
			const res = await request(server.app)
				.post('/register')
				.send({
					email: 'user@test.com',
					name: 'test user',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('password should not be empty');
		});

		it('should return 400 for password length less than 6 characters', async () => {
			const res = await request(server.app)
				.post('/register')
				.send({
					email: 'user@test.com',
					password: 'short',
					name: 'test user',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('password must be longer than or equal to 6 characters');
		});

		it('should return 400 for missing name', async () => {
			const res = await request(server.app)
				.post('/register')
				.send({
					email: 'user@test.com',
					password: 'test1234',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('name should not be empty');
		});

		it('should return 400 for invalid name type', async () => {
			const res = await request(server.app)
				.post('/register')
				.send({
					email: 'user@test.com',
					password: 'test1234',
					name: 1234,
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('name must be a string');
		});
	});

	describe('POST /login (Login User Validation)', () => {
		it('should return 400 for missing email', async () => {
			const res = await request(server.app)
				.post('/login')
				.send({
					password: 'test1234',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('email should not be empty');
		});

		it('should return 400 for invalid email format', async () => {
			const res = await request(server.app)
				.post('/login')
				.send({
					email: 'invalid-email',
					password: 'test1234',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('email must be an email');
		});

		it('should return 400 for missing password', async () => {
			const res = await request(server.app)
				.post('/login')
				.send({
					email: 'user@test.com',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('password should not be empty');
		});

		it('should return 400 for password length less than 6 characters', async () => {
			const res = await request(server.app)
				.post('/login')
				.send({
					email: 'user@test.com',
					password: 'short',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('password must be longer than or equal to 6 characters');
		});
	});

	afterAll(async () => {
		if (testUserId) {
			const userService = new UserService();

			await userService.deleteTestUser(testUserId);
		}
	})
})
