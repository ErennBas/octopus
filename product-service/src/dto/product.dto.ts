import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
	@IsString()
	name: string;

	@IsString()
	description: string;

	@IsNumber()
	@Min(0)
	price: number;
}

export class UpdateProductDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsNumber()
	@Min(0)
	price?: number;
}
