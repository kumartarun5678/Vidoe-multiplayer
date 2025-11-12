class ApiResponse {
    statusCode;
    message;
    data;
    success;
    constructor(statusCode, message, success, data) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = statusCode < 400;
        if (data) {
            this.data = data;
        }
    }
}
export default ApiResponse;
