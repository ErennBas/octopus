import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

export function ValidateDto<T>(dtoClass: new () => T) {
	return (req: Request, res: Response, next: NextFunction) => {
		const dtoInstance = plainToInstance(dtoClass, req.body);
		validate(dtoInstance as any).then((errors) => {
			if (errors.length > 0) {
				const formattedErrors: Record<string, any> = {};

				errors.forEach(error => {
					const { property, constraints } = error;

					if (!formattedErrors[property]) {
						formattedErrors[property] = [];
					}

					Object.values(constraints).forEach(message => {
						formattedErrors[property].push(message);
					});
				});

				res.status(400).json({ errors: formattedErrors });
			} else {
				next();
			}
		});
	};
}
