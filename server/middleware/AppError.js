class AppError extends Error {
    constructor (errorCode) {
        super(errorCode.message)
        this.statusCode = errorCode.code;
        this.isOperational = true; // Optional: to distinguish operational errors from programming errors
    }
}

module.exports = AppError;
