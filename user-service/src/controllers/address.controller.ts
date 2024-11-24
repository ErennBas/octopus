import { NextFunction, Request, Response } from 'express';

import { AddressService } from '../services/address.service';
import { BadRequestError } from '../utils/errors';

export class AddressController {
	private addressService = new AddressService();

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.addressService.create(req.body, req.user);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}

	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.addressService.getAll(req.user);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}

	async getById(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.params.id) throw new BadRequestError('Id is required!');

			const result = await this.addressService.getById(Number(req.params.id), req.user);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.params.id) throw new BadRequestError('Id is required!');

			const result = await this.addressService.update(req.body, Number(req.params.id), req.user);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.params.id) throw new BadRequestError('Id is required!');

			await this.addressService.delete(Number(req.params.id), req.user);
			res.status(200).send();
		} catch (error) {
			next(error);
		}
	}
}
