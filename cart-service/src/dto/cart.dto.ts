import { IsInt, IsMongoId, IsNotEmpty, IsString, Min } from "class-validator";

export class ProductDto {
	@IsString()
	@IsNotEmpty()
	@IsMongoId()
	@IsNotEmpty()
	_id: string;

	@IsInt()
	@Min(1)
	quantity: number;
}
