class CustomError extends Error{
    constructor(message,statusCode = 500){
        super(message);
        this.statusCode = statusCode;
        this.name = "CustomError";
        Error.captureStacKTrace?.(this, this.constructor)
    }
}
module.exports = CustomError;