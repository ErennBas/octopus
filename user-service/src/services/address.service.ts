import { prisma } from '../index';
import { IUser } from '../models/user.model';
import { BadRequestError } from '../utils/errors';
import { IAddress } from '../models/address.model';
import { CreateAddressDto, UpdateAddressDto } from '../dto/address.dto';


export class AddressService {
	async create(createAddressDto: CreateAddressDto, user: IUser): Promise<IAddress> {
		return prisma.addresses.create({ data: { ...createAddressDto, userId: user.id } })
	}

	async getAll(user: IUser): Promise<IAddress[]> {
		return prisma.addresses.findMany({ where: { userId: user.id } });
	}

	async getById(id: number, user: IUser): Promise<IAddress> {
		return this.getAddress(id, user);
	}

	async update(updateAddressDto: UpdateAddressDto, id: number, user: IUser): Promise<IAddress> {
		await this.getAddress(id, user);

		return prisma.addresses.update({ where: { id }, data: updateAddressDto });
	}

	async delete(id: number, user: IUser) {
		await this.getAddress(id, user);

		return prisma.addresses.delete({ where: { id } });
	}

	private async getAddress(id: number, user: IUser): Promise<IAddress> {
		const address = await prisma.addresses.findUnique({ where: { id, userId: user.id } });
		if (!address) throw new BadRequestError('No address found!');

		return address;
	}
}
