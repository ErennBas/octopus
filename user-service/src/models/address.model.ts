export interface IAddress {
	id: number;
	userId?: number;
	name: string;
	country: string;
	city: string;
	street: string;
	createdAt?: Date;
	updatedAt?: Date;
}
