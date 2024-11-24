import bcrypt from 'bcryptjs';
import amqp, { Channel } from 'amqplib';

import { prisma } from '../index';
import { JwtService } from '../utils/jwt';
import { BadRequestError } from '../utils/errors';
import { LoginDto, RegisterDto } from "../dto/user.dto";

export class UserService {
	private jwtService = new JwtService();
	private channel: Channel;

	constructor() {
		this.initRabbitMq();
	}

	async register(registerDto: RegisterDto): Promise<{ token: string }> {
		const existUser = await prisma.user.findUnique({ where: { email: registerDto.email } });
		if (existUser) throw new BadRequestError('This user already exist!');

		const hashedPassword = await bcrypt.hash(registerDto.password, 10);

		const newUser = await prisma.user.create({
			data: { ...registerDto, password: hashedPassword }
		});

		if (!this.channel) {
			await this.initRabbitMq();
		}

		await this.channel.sendToQueue('welcome_email_queue', Buffer.from(JSON.stringify({
			email: newUser.email,
			subject: 'subj',
			body: 'bodu'
		})));

		delete newUser.password;
		return { token: this.jwtService.generate(newUser) };
	}

	async login(loginDto: LoginDto): Promise<{ token: string }> {
		const user = await prisma.user.findUnique({ where: { email: loginDto.email } });
		if (!user) throw new BadRequestError('Wrong password or email!');

		const isValidPassword = await bcrypt.compare(loginDto.password, user.password);
		if (!isValidPassword) throw new BadRequestError('Wrong password or email!');

		delete user.password;
		return { token: this.jwtService.generate(user) };
	}

	async deleteTestUser(id: number) {
		await prisma.user.delete({ where: { id } });
		return true;
	}

	private async initRabbitMq() {
		const connection = await amqp.connect(process.env.RABBITMQ_URL);
		this.channel = await connection.createChannel();

		// Assert welcome_email_queue
		await this.channel.assertQueue('welcome_email_queue', { durable: true });

		this.channel.consume('welcome_email_queue', async (msg) => {
			setTimeout(() => {
				// !!! Burası e posta gönderimini simüle etmek için yazıldı.
				console.log("KUYRUKTAN E POSTA GELDİ");

				this.channel.ack(msg);
			}, 1500);
		});
	}
}
