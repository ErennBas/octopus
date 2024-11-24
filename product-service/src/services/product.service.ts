import { BadRequestError } from "../utils/errors";
import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";
import ProductModel, { IProduct } from "../models/product.model";

export class ProductService {
	async create(createProductDto: CreateProductDto): Promise<IProduct> {
		const product = new ProductModel(createProductDto);
		await product.save();

		return product;
	}

	async getAll(): Promise<IProduct[]> {
		return ProductModel.find();
	}

	async getById(id: string): Promise<IProduct> {
		return this.getProduct(id);
	}

	async update(updateProductDto: UpdateProductDto, id: string): Promise<IProduct> {
		await this.getProduct(id);

		return ProductModel.findByIdAndUpdate(id, updateProductDto, { new: true });
	}

	async delete(id: string): Promise<boolean> {
		await ProductModel.findByIdAndDelete(id);

		return true;
	}

	private async getProduct(id: string): Promise<IProduct> {
		const product = await ProductModel.findById(id);
		if (!product) throw new BadRequestError('No product found!');

		return product;
	}
}
