import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateAddressDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	country: string;

	@IsString()
	@IsNotEmpty()
	city: string;

	@IsString()
	@IsNotEmpty()
	street: string;
}

export class UpdateAddressDto {
	@IsString()
	@IsOptional()
	name: string;

	@IsString()
	@IsOptional()
	country?: string;

	@IsString()
	@IsOptional()
	city?: string;

	@IsString()
	@IsOptional()
	street?: string;
}
