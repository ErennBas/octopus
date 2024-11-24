import express, { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { JwtService } from "./utils/jwt";
import { OrderController } from "./controllers/order.controller";

export const prisma = new PrismaClient();

const app = express();

async function startServer() {
	app.use(express.json());

	const orderController = new OrderController();

	const jwtService = new JwtService();

	app.post('/', jwtService.JwtAuth.bind(jwtService), orderController.create.bind(orderController));
	app.get('/', jwtService.JwtAuth.bind(jwtService), orderController.getByUser.bind(orderController));

	app.all("*", (req: Request, res: Response) => {
		res.status(404).json({ error: `Route ${req.originalUrl} not found` });
	});

	app.use((err: any, req: Request, res: Response, next: NextFunction) => {
		console.error(err);

		// TODO Log servisi olacaksa rabbitmq ya gönder yoksa morgan'ı kur

		const statusCode = err.statusCode || 400;
		const message = err.message || 'Something went wrong';

		res.status(statusCode).json({
			error: message,
		});
	});

	app.listen(Number(process.env.PORT) || 3002, () => {
		console.log(`Server is listening on port ${process.env.PORT || 3002}`);
	});
}

if (process.env.NODE_ENV !== 'test') startServer();

console.log(process.env.DATABASE_URL);


export default { app, startServer };
