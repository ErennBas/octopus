import amqp from 'amqplib';

import ProductModel from './models/product.model';

export async function startRabbitMQ() {
	try {
		const connection = await amqp.connect(process.env.RABBITMQ_URL);
		const channel = await connection.createChannel();

		await channel.assertQueue('product_stock_update', { durable: true });
		await channel.assertQueue('cart_product_quantity', { durable: true });

		channel.consume('product_stock_update', async (msg) => {
			if (msg) {
				const orderData = JSON.parse(msg.content.toString()) as Order;

				const newStock = await updateStock(orderData);

				channel.ack(msg);

				// Send to cart quantity update quaue
				channel.sendToQueue('cart_product_quantity', Buffer.from(JSON.stringify({
					productId: orderData.productId,
					newStock
				})));
			}
		});

		// TODO Loglamayı unutma
		console.log('RabbitMQ consumer startes');
	} catch (error) {
		console.error('RabbitMQ connn error: ', error);
	}
}

async function updateStock(orderData: Order): Promise<number> {
	try {
		const product = await ProductModel.findById(orderData.productId);

		if (!product) {
			// TODO Loglanmalı
			console.log('No Product');
			return;
		}

		product.stock -= orderData.quantity;
		await product.save();

		return product.stock;
	} catch (err) {
		// TODO Loglanmalı
		console.error('Error when update product stock', err);
	}
}

interface Order {
	productId: string;
	quantity: number;
}
