import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { IUser } from '../models/user.model';

export class JwtService {
	private sercret = "secret";
	private expiresIn = "1h";

	generate(payload: Record<string, any>): string {
		return jwt.sign(payload, this.sercret, { expiresIn: this.expiresIn });
	}

	JwtAuth(req: Request, res: any, next: Function) {
		const token = req.headers['authorization']?.split(' ')[1];

		if (!token) {
			return res.status(403).json({ message: 'No token provided' });
		}

		jwt.verify(token, this.sercret, (err, decoded) => {
			if (err) {
				return res.status(401).json({ message: 'Invalid or expired token' });
			}
			req.user = decoded as IUser;
			next();
		});
	}
}
