import mongoose from 'mongoose';
import express, { NextFunction, Request, Response } from "express";

import { JwtService } from "./utils/jwt";
import { ValidateDto } from "./utils/validate";
import { ProductController } from "./controllers/product.controller";
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { startRabbitMQ } from './rabbitmq';

const app = express();

async function main() {
	app.use(express.json());

	// Routes
	const productController = new ProductController();

	const jwtService = new JwtService();

	app.post('/', jwtService.JwtAuth.bind(jwtService), ValidateDto(CreateProductDto), productController.create.bind(productController));
	app.get('/', jwtService.JwtAuth.bind(jwtService), productController.getAll.bind(productController));
	app.get('/:id', jwtService.JwtAuth.bind(jwtService), productController.getById.bind(productController));
	app.put('/:id', jwtService.JwtAuth.bind(jwtService), ValidateDto(UpdateProductDto), productController.update.bind(productController));
	app.delete('/:id', jwtService.JwtAuth.bind(jwtService), productController.delete.bind(productController));

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

	app.listen(Number(process.env.PORT) || 3003, () => {
		console.log('Server is listening on port 3003');
	});

}

main()
	.then(async () => {
		mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/octopus-case')
			.then(() => console.log('MongoDB bağlantısı başarılı'))
			.catch(err => console.error('MongoDB bağlantı hatası: ', err));
		await startRabbitMQ();
	})
	.catch(async (e) => {
		console.error(e);
		await mongoose.disconnect();
		process.exit(1);
	});

export default app;
