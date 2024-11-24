import request from 'supertest';
import { Server } from 'http';
import app from './index';

let server: Server;
beforeAll(() => {
	server = app.listen(9000);
});

afterAll((done) => {
	server.close(done);
});

describe('API Gateway', () => {
	it('should respond to /user', async () => {
		const response = await request(server).get('/user');
		expect(response.status).toBe(200);
	});

	it('should respond to /product', async () => {
		const response = await request(server).get('/product');
		expect(response.status).toBe(200);
	});

	it('should respond to /cart', async () => {
		const response = await request(server).get('/cart');
		expect(response.status).toBe(200);
	});

	it('should respond to /order', async () => {
		const response = await request(server).get('/order');
		expect(response.status).toBe(200);
	});
});
