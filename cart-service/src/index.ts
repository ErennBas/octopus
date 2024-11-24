import 'reflect-metadata'; // For class-validator
import mongoose from 'mongoose';
import express, { NextFunction, Request, Response } from "express";

import { JwtService } from "./utils/jwt";
import { ValidateDto } from "./utils/validate";
import { CartController } from './controllers/cart.controller';
import { ProductDto } from './dto/cart.dto';

const app = express();

async function main() {
	app.use(express.json());

	const cartController = new CartController();

	const jwtService = new JwtService();

	app.post('/', jwtService.JwtAuth.bind(jwtService), ValidateDto(ProductDto), cartController.create.bind(cartController));
	app.get('/', jwtService.JwtAuth.bind(jwtService), cartController.get.bind(cartController));
	app.put('/add-product', jwtService.JwtAuth.bind(jwtService), ValidateDto(ProductDto), cartController.addProduct.bind(cartController));
	app.put('/remove-product', jwtService.JwtAuth.bind(jwtService), ValidateDto(ProductDto), cartController.removeProduct.bind(cartController));
	app.put('/update-quantity', jwtService.JwtAuth.bind(jwtService), ValidateDto(ProductDto), cartController.updateQuantity.bind(cartController));
	app.delete('/', jwtService.JwtAuth.bind(jwtService), cartController.delete.bind(cartController));

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

	app.listen(Number(process.env.PORT) || 3001, () => {
		console.log('Server is listening on port 3001');
	});
}

main()
	.then(async () => {
		mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/octopus-case')
			.then(() => console.log('MongoDB bağlantısı başarılı'))
			.catch(err => console.error('MongoDB bağlantı hatası: ', err));
	})
	.catch(async (e) => {
		console.error(e);
		await mongoose.disconnect();
		process.exit(1);
	});

export default app;
