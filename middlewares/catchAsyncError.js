import { errHandler } from "./error.js";

export const catchAsyncError = (passedFunction) => (req, res, next) => {
    Promise.resolve(passedFunction(req, res, next)).catch(err => next(new errHandler(err.message, 400)));
}