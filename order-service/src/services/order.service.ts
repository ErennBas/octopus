import axios from "axios";

import { prisma } from "..";
import { ICart } from "../models/cart.model";
import { IUser } from "../models/user.model";
import { IOrder } from "../models/order.model";
import { IProduct } from "../models/product.model";
import { BadRequestError, NotFoundError } from "../utils/errors";

export class OrderService {
	async create(user: IUser, userToken: string): Promise<IOrder> {
		const cart = await axios.get<ICart>(process.env.CART_SERVICE, { headers: { Authorization: userToken } });
		if (cart.status !== 200) throw new BadRequestError('There is no cart for user!');

		let totalPrice = 0;
		const order = await prisma.order.create({ data: { userId: user.id } });

		for (let product of cart.data.products) {
			const res = await axios.get<IProduct>(`${process.env.PRODUCT_SERVICE}/${product._id}`, { headers: { Authorization: userToken } });

			if (res.status !== 200) throw new BadRequestError('There is no product');

			await prisma.orderItem.create({
				data: {
					orderId: order.id,
					productId: res.data._id,
					quantity: product.quantity,
					price: res.data.price,
					totalPrice: res.data.price * product.quantity
				}
			});

			totalPrice += (res.data.price * product.quantity);
		}

		await prisma.order.update({ where: { id: order.id, userId: user.id }, data: { totalPrice } });

		// TODO rabbitmq ile product serviceye stock düşümü mesajı yolla

		return prisma.order.findUnique({ where: { id: order.id } });
	}

	async getByUser(user: IUser): Promise<IOrder[]> {
		return prisma.order.findMany({ where: { userId: user.id } });
	}

	async updateStatus(status: any, orderId: number, user: IUser): Promise<void> {
		const order = await prisma.order.findUnique({ where: { id: orderId, userId: user.id } });
		if (!order) throw new NotFoundError('Order Not Found');

		await prisma.order.update({ where: { id: orderId, userId: user.id }, data: { status } });
	}
}
