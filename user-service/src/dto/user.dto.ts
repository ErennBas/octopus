import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class RegisterDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@Length(6, 20)
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsNotEmpty()
	name: string;
}

export class LoginDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@Length(6, 20)
	@IsNotEmpty()
	password: string;
}
