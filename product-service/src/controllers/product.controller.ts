import { NextFunction, Request, Response } from 'express';

import { ProductService } from '../services/product.service';
import { BadRequestError } from '../utils/errors';

export class ProductController {
	private productService = new ProductService();

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.productService.create(req.body);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}

	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.productService.getAll();
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}

	async getById(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.params.id) throw new BadRequestError('Id is required!');

			const result = await this.productService.getById(req.params.id);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.params.id) throw new BadRequestError('Id is required!');
			
			const result = await this.productService.update(req.body, req.params.id);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.params.id) throw new BadRequestError('Id is required!');

			await this.productService.delete(req.params.id);
			res.status(200).send();
		} catch (error) {
			next(error);
		}
	}
}
