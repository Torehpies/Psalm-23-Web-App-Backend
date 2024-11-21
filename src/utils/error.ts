class CustomError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
		this.name = "CustomError";
	}
}

export const CreateError = (status: number, message: string) => {
	return new CustomError(status, message);
}

