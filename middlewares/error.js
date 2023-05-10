export class errHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error"
    err.statusCode = err.statusCode || 400
    console.log(`${err.message} at ${req.url} on ${req.method} Method`)
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}