import { NextFunction, Request, Response } from 'express';

import { CartService } from '../services/cart.service';

export class CartController {
	private cartService = new CartService();

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.cartService.create(req.body, req.user);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}

	async get(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.cartService.getByUser(req.user);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}

	async addProduct(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.cartService.addProduct(req.body, req.user);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}

	async removeProduct(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.cartService.removeProduct(req.body, req.user);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}

	async updateQuantity(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.cartService.updateQuantity(req.body, req.user);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			await this.cartService.deleteCart(req.user);
			res.status(200).send();
		} catch (error) {
			next(error);
		}
	}
}
