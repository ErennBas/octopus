import { IAddress } from "./address.model";

export interface IUser {
	id: number;
	email: string;
	password: string;
	name: string;
	createdAt?: Date;
	updatedAt?: Date;
	addresses?: IAddress[];
}
