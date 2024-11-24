import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import amqp from 'amqplib';

dotenv.config({ path: '../.env' });

async function startRabbit() {
	const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
	const channel = await connection.createChannel();

	await channel.assertQueue('product_stock_update', { durable: true });

	channel.sendToQueue('product_stock_update', Buffer.from(JSON.stringify({
		productId: "673f364516d9381ffa73dc11",
		quantity: 2
	})));
}

startRabbit();

const app = express();

const config = {
	cartService: process.env.CART_SERVICE as string,
	orderService: process.env.ORDER_SERVICE as string,
	productService: process.env.PRODUCT_SERVICE as string,
	userService: process.env.USER_SERVICE as string
}

console.log(config);

const createProxy = (name: string, url: string, isDocs = false) => {
	return createProxyMiddleware({
		target: isDocs ? `${url}/docs` : url,
		changeOrigin: true,
		pathRewrite: { [`^/${name}`]: '' }
	});
};

// Services
app.use('/cart', createProxy('cart', config.cartService));
app.use('/order', createProxy('order', config.orderService));
app.use('/product', createProxy('product', config.productService));
app.use('/user', createProxy('user', config.userService));

if (process.env.NODE_ENV === 'dev') {
	app.use('/docs/cart', createProxy('cart', config.cartService, true));
	app.use('/docs/order', createProxy('order', config.orderService, true));
	app.use('/docs/product', createProxy('product', config.productService, true));
	app.use('/docs/user', createProxy('user', config.userService, true));
}

// Login & Register
app.use('/login', createProxyMiddleware({
	target: `${process.env.USER_SERVICE}/login`,
	changeOrigin: true
}));

app.use('/register', createProxyMiddleware({
	target: `${process.env.USER_SERVICE}/register`,
	changeOrigin: true
}));

app.listen(3000, () => {
	console.log(`API Gateway running at http://localhost:3000`);
});

export default app;
