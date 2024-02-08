"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../schema/User"));
const UserAuth_1 = __importDefault(require("../../schema/UserAuth"));
/**
 * Middleware class for user verification.
 */
class UserVerify {
    /**
     * Middleware function to verify if a username already exists in the database.
     * If the username exists, it appends the current timestamp to the username.
     * @param req - The Express request object.
     * @param res - The Express response object.
     * @param next - The next middleware function.
     */
    static async verifyUsername(req, res, next) {
        const body = req.body;
        const isUsernameExist = await User_1.default.findOne({
            username: req.body.username,
        });
        if (isUsernameExist) {
            body.username = `${body.username}_${Date.now()}`;
            return next();
        }
        return next();
    }
    /**
     * Middleware function to verify if the email already exists in the database.
     * If the email exists, it sends a response with status 409 and a message indicating that the email already exists.
     * Otherwise, it calls the next middleware function.
     *
     * @param req - The Express request object.
     * @param res - The Express response object.
     * @param next - The next middleware function.
     */
    static async verifyEmail(req, res, next) {
        const isEmailExist = await UserAuth_1.default.findOne({
            email: req.body.email,
        });
        if (isEmailExist) {
            const response = {
                status: 409,
                message: "Email already exists!",
            };
            return res.status(response.status).json(response);
        }
        return next();
    }
}
exports.default = UserVerify;
//# sourceMappingURL=user.verify.js.map