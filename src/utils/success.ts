export const CreateSuccess = (statusCode: number, successMessage: string, data?: any) => {
	const successObj = {
		status: statusCode,
		message: successMessage,
		data: data
	}

	return successObj;
}