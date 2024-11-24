import { ProductDto } from "../dto/cart.dto";
import { NotFoundError } from "../utils/errors";
import CartModel, { ICart } from "../models/cart.model";
import { IUser } from "../models/user.model";

export class CartService {
	async create(productDto: ProductDto | ProductDto[], user: IUser): Promise<ICart> {
		const cart = await CartModel.findOne<ICart>({ userId: user.id });

		if (cart) return this.addProduct(productDto as ProductDto, user);

		const products = Array.isArray(productDto) ? productDto : [productDto];
		const newCart = new CartModel({ products, userId: user.id });
		await newCart.save();

		return newCart;
	}

	async getByUser(user: IUser): Promise<ICart> {
		return this.getCart(user);
	}

	async addProduct(productDto: ProductDto, user: IUser): Promise<ICart> {
		const cart = await this.getCart(user);

		const productIndex = cart.products.findIndex((p) => p._id.toString() === productDto._id);
		if (productIndex === -1) {
			cart.products.push(productDto);
		} else {
			cart.products[productIndex].quantity += productDto.quantity;
		}

		await cart.save();

		return cart;
	}

	async removeProduct(productDto: ProductDto, user: IUser): Promise<ICart> {
		const cart = await this.getCart(user);

		const productIndex = cart.products.findIndex((p) => p._id.toString() === productDto._id);
		if (productIndex === -1) throw new NotFoundError('No Cart Found');

		delete cart.products[productIndex];

		return cart;
	}

	async updateQuantity(productDto: ProductDto, user: IUser): Promise<ICart> {
		const cart = await this.getCart(user);

		const productIndex = cart.products.findIndex((p) => p._id.toString() === productDto._id);
		if (productIndex === -1) {
			cart.products.push(productDto);
		} else {
			cart.products[productIndex].quantity = productDto.quantity;
		}

		await cart.save();

		return cart;
	}

	async deleteCart(user: IUser): Promise<void> {
		await CartModel.findOneAndDelete({ userId: user.id });
	}

	private async getCart(user: IUser): Promise<ICart> {
		let cart = await CartModel.findOne<ICart>({ userId: user.id });
		if (!cart) {
			cart = await this.create([], user);
		}

		return cart;
	}
}
