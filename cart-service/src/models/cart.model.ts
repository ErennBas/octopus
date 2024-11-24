import mongoose, { Schema, Document } from 'mongoose';

export interface ICart extends Document {
	userId: number;
	products: IProduct[];
}

export interface IProduct {
	_id: string;
	quantity: number;
}

const cartSchema = new Schema<ICart>({
	userId: { type: Number, required: true },
	products: [
		{
			_id: { type: Schema.Types.ObjectId, required: true },
			quantity: { type: Number, required: true },
		}
	]
}, { timestamps: true });

const CartModel = mongoose.model<ICart>('Cart', cartSchema);

export default CartModel;
