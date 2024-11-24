export interface IOrder {
	id?: number;
	userId: number;
	totalPrice: number;
	status: string | 'PENDING' | 'PREPEARING' | 'SHIPPED' | 'DELIVERED';
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IOrderProduct {
	id: number;
	orderId: number;
	productId: string;
	quantity: number;
	price: number;
	totalPrice: number;
}
