import request from 'supertest';

import app from '../index';
import { JwtService } from '../utils/jwt';

describe('Product API', () => {
	let token: string;
	let testProductId: string;

	const jwtService = new JwtService();

	beforeAll(async () => {
		token = await jwtService.generate({ name: 'test user' });
	});

	describe('POST /product', () => {
		it('should create a product successfully', async () => {
			const res = await request(app)
				.post('/')
				.set('Authorization', `Bearer ${token}`)
				.send({
					name: 'Test Product',
					price: 100,
					description: 'A test product',
				});

			expect(res.status).toBe(201);
			expect(res.body.name).toBe('Test Product');
			testProductId = res.body._id;
		});

		it('should return 403 if not authenticated', async () => {
			const res = await request(app)
				.post('/')
				.send({
					name: 'Test Product',
					price: 100,
					description: 'A test product',
				});

			expect(res.status).toBe(403);
		});

		it('should return 401 if token is invalid', async () => {
			const res = await request(app)
				.post('/')
				.set('Authorization', `Bearer invalid-token`)
				.send({
					name: 'Test Product',
					price: 100,
					description: 'A test product',
				});

			expect(res.status).toBe(401);
		});

		it('should return 400 if required fields are missing', async () => {
			const res = await request(app)
				.post('/')
				.set('Authorization', `Bearer ${token}`)
				.send({
					name: 'Test Product',
					price: 100,
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('description must be a string');
		});
	});

	describe('GET /product', () => {
		it('should get all products successfully', async () => {
			const res = await request(app)
				.get('/')
				.set('Authorization', `Bearer ${token}`);

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body)).toBe(true);
		});

		it('should return 403 if not authenticated', async () => {
			const res = await request(app).get('/');

			expect(res.status).toBe(403);
		});

		it('should return 401 if token is invalid', async () => {
			const res = await request(app)
				.get('/')
				.set('Authorization', `Bearer invalid-token`);

			expect(res.status).toBe(401);
		});
	});

	describe('GET /product/:id', () => {
		it('should get product by ID successfully', async () => {
			const res = await request(app)
				.get(`/${testProductId}`)
				.set('Authorization', `Bearer ${token}`);

			expect(res.status).toBe(200);
			expect(res.body._id).toBe(testProductId);
		});

		it('should return 403 if not authenticated', async () => {
			const res = await request(app).get(`/${testProductId}`);

			expect(res.status).toBe(403);
		});

		it('should return 401 if token is invalid', async () => {
			const res = await request(app)
				.get(`/${testProductId}`)
				.set('Authorization', `Bearer invalid-token`);

			expect(res.status).toBe(401);
		});
	});

	describe('PUT /product/:id', () => {
		it('should update product successfully', async () => {
			const res = await request(app)
				.put(`/${testProductId}`)
				.set('Authorization', `Bearer ${token}`)
				.send({
					name: 'Updated Product',
					price: 150,
					description: 'Updated description',
				});

			expect(res.status).toBe(200);
			expect(res.body.name).toBe('Updated Product');
			expect(res.body.price).toBe(150);
		});

		it('should return 403 if not authenticated', async () => {
			const res = await request(app)
				.put(`/${testProductId}`)
				.send({
					name: 'Updated Product',
					price: 150,
					description: 'Updated description',
				});

			expect(res.status).toBe(403);
		});

		it('should return 401 if token is invalid', async () => {
			const res = await request(app)
				.put(`/${testProductId}`)
				.set('Authorization', `Bearer invalid-token`)
				.send({
					name: 'Updated Product',
					price: 150,
					description: 'Updated description',
				});

			expect(res.status).toBe(401);
		});

		it('should return 400 if fields are invalid', async () => {
			const res = await request(app)
				.put(`/${testProductId}`)
				.set('Authorization', `Bearer ${token}`)
				.send({
					name: 1234,
					price: 'invalid',
					description: 'Updated description',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('name must be a string');
			expect(res.body.message).toContain('price must be a number');
		});
	});

	describe('DELETE /product/:id', () => {
		it('should delete product successfully', async () => {
			const res = await request(app)
				.delete(`/${testProductId}`)
				.set('Authorization', `Bearer ${token}`);

			expect(res.status).toBe(200);
		});

		it('should return 403 if not authenticated', async () => {
			const res = await request(app).delete(`/${testProductId}`);

			expect(res.status).toBe(403);
		});

		it('should return 401 if token is invalid', async () => {
			const res = await request(app)
				.delete(`/${testProductId}`)
				.set('Authorization', `Bearer invalid-token`);

			expect(res.status).toBe(401);
		});
	});
});
