import request from 'supertest';

import server from '../index';
import { IUser } from '../models/user.model';
import { IAddress } from '../models/address.model';
import { UserService } from '../services/user.service';

describe('Address API', () => {
	let token: string;
	let testAddressId: number;
	let testUserId: number;

	const userService = new UserService();

	beforeAll(async () => {
		await server.startServer();

		const res = await request(server.app).post('/register').send({
			email: 'user@tests.com',
			password: 'test1234',
			name: 'test user'
		});

		token = res.body.token;
		testUserId = (JSON.parse(atob(token.split('.')[1])) as IUser).id;
	});

	describe('POST /address', () => {
		it('should create an address', async () => {
			const res = await request(server.app)
				.post('/address')
				.set('Authorization', `Bearer ${token}`)
				.send({
					name: 'Test Address',
					country: 'Country',
					city: 'City',
					street: 'Street'
				});

			expect(res.status).toBe(201);
			expect(res.body.name).toBe('Test Address');
			testAddressId = res.body.id;
		});

		it('should get 403 error from create an address endpoint', async () => {
			const res = await request(server.app)
				.post('/address')
				.send({
					name: 'Test Address',
					country: 'Country',
					city: 'City',
					street: 'Street'
				});

			expect(res.status).toBe(403);
		});

		it('should get 401 error from create an address endpoint', async () => {
			const res = await request(server.app)
				.post('/address')
				.set('Authorization', `Bearer invalid-token`)
				.send({
					name: 'Test Address',
					country: 'Country',
					city: 'City',
					street: 'Street'
				});

			expect(res.status).toBe(401);
		});
	});

	describe('POST /address (Address Validation)', () => {
		it('should return 400 for missing name field', async () => {
			const res = await request(server.app)
				.post('/address')
				.set('Authorization', `Bearer ${token}`)
				.send({
					country: 'Country',
					city: 'City',
					street: 'Street',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('name should not be empty');
		});

		it('should return 400 for missing country field', async () => {
			const res = await request(server.app)
				.post('/address')
				.set('Authorization', `Bearer ${token}`)
				.send({
					name: 'Test Address',
					city: 'City',
					street: 'Street',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('country should not be empty');
		});

		it('should return 400 for missing city field', async () => {
			const res = await request(server.app)
				.post('/address')
				.set('Authorization', `Bearer ${token}`)
				.send({
					name: 'Test Address',
					country: 'Country',
					street: 'Street',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('city should not be empty');
		});

		it('should return 400 for missing street field', async () => {
			const res = await request(server.app)
				.post('/address')
				.set('Authorization', `Bearer ${token}`)
				.send({
					name: 'Test Address',
					country: 'Country',
					city: 'City',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('street should not be empty');
		});

		it('should return 400 for invalid data types', async () => {
			const res = await request(server.app)
				.post('/address')
				.set('Authorization', `Bearer ${token}`)
				.send({
					name: 1234,
					country: 'Country',
					city: 'City',
					street: 'Street',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('name must be a string');
		});
	})

	describe('GET / address', () => {
		it('should get all addresses', async () => {
			const res = await request(server.app)
				.get('/address')
				.set('Authorization', `Bearer ${token}`);

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body)).toBe(true);
			expect(res.body.find((el: IAddress) => el.id === testAddressId)).not.toBe(undefined);
		});

		it('should get 403 error from all addresses endpoint', async () => {
			const res = await request(server.app)
				.get('/address')

			expect(res.status).toBe(403);
		});

		it('should get 401 error from all addresses endpoint', async () => {
			const res = await request(server.app)
				.get('/address')
				.set('Authorization', `Bearer invalid-token`);

			expect(res.status).toBe(401);
		});
	});

	describe('GET /address/:id', () => {
		it('should get ab address by id', async () => {
			const res = await request(server.app)
				.get(`/address/${testAddressId}`)
				.set('Authorization', `Bearer ${token}`);

			expect(res.status).toBe(200);
			expect(res.body.id).toBe(testAddressId);
		});

		it('should get 403 error from address by id endpoint', async () => {
			const res = await request(server.app)
				.get(`/address/${testAddressId}`);

			expect(res.status).toBe(403);
		});

		it('should get 401 error from address by id endpoint', async () => {
			const res = await request(server.app)
				.get(`/address/${testAddressId}`)
				.set('Authorization', `Bearer invalid-token`);

			expect(res.status).toBe(401);
		});
	});

	describe('PUT /address/:id', () => {
		it('should update an addeess', async () => {
			const res = await request(server.app)
				.put(`/address/${testAddressId}`)
				.set('Authorization', `Bearer ${token}`)
				.send({
					name: 'Test Address Updatedd',
					country: 'Country Updated',
					city: 'City Updated',
					street: 'Street Updated'
				});

			expect(res.status).toBe(200);
			expect(res.body.name).toBe('Test Address Updatedd');
			expect(res.body.country).toBe('Country Updated');
			expect(res.body.city).toBe('City Updated');
			expect(res.body.street).toBe('Street Updated');
		});

		it('should get 403 error from update an address endpoint', async () => {
			const res = await request(server.app)
				.put(`/address/${testAddressId}`)
				.send({
					name: 'Test Address Updatedd',
					country: 'Country Updated',
					city: 'City Updated',
					street: 'Street Updated'
				});

			expect(res.status).toBe(403);
		});

		it('should get 401 error from update an address endpoint', async () => {
			const res = await request(server.app)
				.put(`/address/${testAddressId}`)
				.set('Authorization', `Bearer invalid-token`)
				.send({
					name: 'Test Address Updatedd',
					country: 'Country Updated',
					city: 'City Updated',
					street: 'Street Updated'
				});

			expect(res.status).toBe(401);
		});
	});

	describe('PUT /address/:id (Update Address Validation)', () => {
		it('should return 400 for invalid name type', async () => {
			const res = await request(server.app)
				.put(`/address/${testAddressId}`)
				.set('Authorization', `Bearer ${token}`)
				.send({
					name: 1234,
					country: 'Country Updated',
					city: 'City Updated',
					street: 'Street Updated',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('name must be a string');
		});

		it('should return 400 for invalid country type', async () => {
			const res = await request(server.app)
				.put(`/address/${testAddressId}`)
				.set('Authorization', `Bearer ${token}`)
				.send({
					name: 'Test Address Updated',
					country: 1234,
					city: 'City Updated',
					street: 'Street Updated',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('country must be a string');
		});

		it('should not return an error when optional fields are not provided', async () => {
			const res = await request(server.app)
				.put(`/address/${testAddressId}`)
				.set('Authorization', `Bearer ${token}`)
				.send({
					name: 'Test Address Updated',
				});

			expect(res.status).toBe(200);
			expect(res.body.name).toBe('Test Address Updated');
		});

		it('should return 400 if optional fields have invalid data', async () => {
			const res = await request(server.app)
				.put(`/address/${testAddressId}`)
				.set('Authorization', `Bearer ${token}`)
				.send({
					name: 'Test Address Updated',
					country: 'Country Updated',
					city: 'City Updated',
					street: 1234,
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain('street must be a string');
		});
	});

	describe('DELETE /address/:id', () => {
		it('should delete an address by id', async () => {
			const res = await request(server.app)
				.delete(`/address/${testAddressId}`)
				.set('Authorization', `Bearer ${token}`);

			expect(res.status).toBe(200);
		});

		it('should get 403 error from delete address endpoint', async () => {
			const res = await request(server.app)
				.delete(`/address/${testAddressId}`);

			expect(res.status).toBe(403);
		});

		it('should get 401 error from delete address endpoint', async () => {
			const res = await request(server.app)
				.delete(`/address/${testAddressId}`)
				.set('Authorization', `Bearer invalid-token`);

			expect(res.status).toBe(401);
		});
	});

	afterAll(async () => {
		await userService.deleteTestUser(testUserId);
	})
})
