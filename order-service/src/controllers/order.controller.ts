import { NextFunction, Request, Response } from 'express';

import { OrderService } from "../services/order.service";

export class OrderController {
	private orderService = new OrderService();

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.orderService.create(req.user, req.headers.authorization);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}

	async getByUser(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.orderService.getByUser(req.user)
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}
