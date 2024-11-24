export interface ICart {
	id: string;
	userId: number;
	products: IProduct[];
}

interface IProduct {
	_id: string;
	quantity: number;
}
