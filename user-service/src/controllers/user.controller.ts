import { NextFunction, Request, Response } from 'express';

import { UserService } from '../services/user.service';

export class UserController {
	private userService = new UserService();

	async register(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.userService.register(req.body);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.userService.login(req.body);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}
