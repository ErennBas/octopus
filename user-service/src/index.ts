import express, { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { JwtService } from "./utils/jwt";
import { ValidateDto } from "./utils/validate";
import { LoginDto, RegisterDto } from "./dto/user.dto";
import { UserController } from "./controllers/user.controller";
import { AddressController } from "./controllers/address.controller";
import { CreateAddressDto, UpdateAddressDto } from "./dto/address.dto";

export const prisma = new PrismaClient();

const app = express();

async function startServer() {
	app.use(express.json());

	const userController = new UserController();
	const addressController = new AddressController();

	const jwtService = new JwtService();

	app.post('/login', ValidateDto(LoginDto), userController.login.bind(userController));
	app.post('/register', ValidateDto(RegisterDto), userController.register.bind(userController));

	app.post('/address', jwtService.JwtAuth.bind(jwtService), ValidateDto(CreateAddressDto), addressController.create.bind(addressController));
	app.get('/address', jwtService.JwtAuth.bind(jwtService), addressController.getAll.bind(addressController));
	app.get('/address/:id', jwtService.JwtAuth.bind(jwtService), addressController.getById.bind(addressController));
	app.put('/address/:id', jwtService.JwtAuth.bind(jwtService), ValidateDto(UpdateAddressDto), addressController.update.bind(addressController));
	app.delete('/address/:id', jwtService.JwtAuth.bind(jwtService), addressController.delete.bind(addressController));

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

	app.listen(Number(process.env.PORT) || 3004, () => {
		console.log(`Server is listening on port ${process.env.PORT || 3004}`);
	});
}

if (process.env.NODE_ENV !== 'test') startServer();

export default { app, startServer };
