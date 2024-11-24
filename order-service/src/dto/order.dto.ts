import { IsMongoId, IsString } from "class-validator";

export class CreateOrderDto {
	@IsString()
	@IsMongoId()
	cartId: string;
}
