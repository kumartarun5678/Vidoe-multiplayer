class ApiResponse {
    statusCode: number;
    message: string;
    data?: any;
    success: boolean;
    constructor (
        statusCode: number,
        message: string,
        success: boolean,
        data?: any
    ) {
        this.statusCode = statusCode
        this.message = message
        this.success = statusCode < 400;
        if (data) {
            this.data = data;
        }
    }
}
export default ApiResponse