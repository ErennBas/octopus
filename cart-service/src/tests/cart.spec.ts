import request from 'supertest';
import mongoose from 'mongoose';

import app from '..';
import { JwtService } from '../utils/jwt';

describe('Cart API End-to-End Tests', () => {
	const jwtService = new JwtService();

	let token: string;
	let testProductId = new mongoose.Types.ObjectId().toString();

	beforeAll(async () => {
		token = await jwtService.generate({ id: 0 });
	});

	describe('POST /', () => {
		it('should create a new cart with valid data and token', async () => {
			const product = { _id: testProductId, quantity: 2 };
			const res = await request(app)
				.post('/')
				.set('Authorization', `Bearer ${token}`)
				.send(product);

			expect(res.status).toBe(201);
			expect(res.body.products).toHaveLength(1);
			expect(res.body.products[0]).toEqual(product);
		});

		it('should return 401 for invalid token', async () => {
			const product = { _id: testProductId, quantity: 2 };
			const res = await request(app)
				.post('/')
				.set('Authorization', `Bearer invalid-token`)
				.send(product);

			expect(res.status).toBe(401);
		});

		it('should return 403 for missing token', async () => {
			const product = { _id: testProductId, quantity: 2 };
			const res = await request(app).post('/').send(product);

			expect(res.status).toBe(403);
		});
	});

	describe('GET /', () => {
		it('should retrieve the cart for a user', async () => {
			const res = await request(app)
				.get('/')
				.set('Authorization', `Bearer ${token}`);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('products');
		});

		it('should return 401 for invalid token', async () => {
			const res = await request(app)
				.get('/')
				.set('Authorization', `Bearer invalid-token`);

			expect(res.status).toBe(401);
		});

		it('should return 403 for missing token', async () => {
			const res = await request(app).get('/');

			expect(res.status).toBe(403);
		});
	});

	describe('PIT /add-product', () => {
		it('should add a product to the cart', async () => {
			const product = { _id: testProductId, quantity: 3 };
			const res = await request(app)
				.put('/add-product')
				.set('Authorization', `Bearer ${token}`)
				.send(product);

			product.quantity = 5;
			expect(res.status).toBe(200);
			expect(res.body.products).toEqual(
				expect.arrayContaining([expect.objectContaining(product)])
			);
		});

		it('should return 401 for invalid token', async () => {
			const product = { _id: testProductId, quantity: 3 };
			const res = await request(app)
				.put('/add-product')
				.set('Authorization', `Bearer invalid-token`)
				.send(product);

			expect(res.status).toBe(401);
		});

		it('should return 403 for missing token', async () => {
			const product = { _id: testProductId, quantity: 3 };
			const res = await request(app).put('/add-product').send(product);

			expect(res.status).toBe(403);
		});
	});

	describe('PUT /remove-product', () => {
		it('should remove a product from the cart', async () => {
			const product = { _id: testProductId, quantity: 1 };
			const res = await request(app)
				.put('/remove-product')
				.set('Authorization', `Bearer ${token}`)
				.send(product);

			expect(res.status).toBe(200);
		});

		it('should return 401 for invalid token', async () => {
			const product = { _id: testProductId };
			const res = await request(app)
				.put('/remove-product')
				.set('Authorization', `Bearer invalid-token`)
				.send(product);

			expect(res.status).toBe(401);
		});

		it('should return 403 for missing token', async () => {
			const product = { _id: testProductId };
			const res = await request(app).put('/remove-product').send(product);

			expect(res.status).toBe(403);
		});
	});

	describe('DELETE /', () => {
		it('should delete the cart for a user', async () => {
			const res = await request(app)
				.delete('/')
				.set('Authorization', `Bearer ${token}`);

			expect(res.status).toBe(200);
		});

		it('should return 401 for invalid token', async () => {
			const res = await request(app)
				.delete('/')
				.set('Authorization', `Bearer invalid-token`);

			expect(res.status).toBe(401);
		});

		it('should return 403 for missing token', async () => {
			const res = await request(app).delete('/');
			expect(res.status).toBe(403);
		});
	});
});
