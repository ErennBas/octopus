export class HttpError extends Error {
	public statusCode: number;
	public errorCode: string;

	constructor(message: string, statusCode: number, errorCode: string) {
		super(message);
		this.statusCode = statusCode;
		this.errorCode = errorCode;
		Object.setPrototypeOf(this, HttpError.prototype);
	}
}

export class NotFoundError extends HttpError {
	constructor(message: string) {
		super(message, 404, "NOT_FOUND");
	}
}

export class UnauthorizedError extends HttpError {
	constructor(message: string) {
		super(message, 401, "UNAUTHORIZED");
	}
}

export class BadRequestError extends HttpError {
	constructor(message: string) {
		super(message, 400, "BAD_REQUEST");
	}
}

export class InternalServerError extends HttpError {
	constructor(message: string) {
		super(message, 500, "INTERNAL_SERVER_ERROR");
	}
}
