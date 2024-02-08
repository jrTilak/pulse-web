"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidator = void 0;
const zod_1 = require("zod");
const reponse_controllers_1 = __importDefault(require("../../controllers/reponse-controllers"));
const auth_utils_1 = __importDefault(require("../../utils/auth-utils"));
/**
 * A class that provides validation schemas and methods for authentication related operations.
 */
class AuthValidator {
    /**
     * Schema for validating guest user data.
     */
    static guestUserSchema = zod_1.z.object({
        name: zod_1.z.string().min(3).max(20),
        username: zod_1.z.string().min(3).max(20).startsWith("guest_"),
        method: zod_1.z.array(zod_1.z.literal("guest")).default(["guest"]),
    });
    /**
     * Schema for validating email user data.
     */
    static emailUserSchema = zod_1.z.object({
        name: zod_1.z.string().min(3).max(40),
        username: zod_1.z.string().min(3).max(40),
        method: zod_1.z.array(zod_1.z.literal("email")).default(["email"]),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8).max(20),
    });
    /**
     * Schema for validating login credentials.
     */
    static loginCredentialsSchema = zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8).max(20),
    });
    /**
     * Validates the request body for creating a new user.
     */
    static validateNewUser(req, res, next) {
        try {
            const method = req.url === "/guest" ? "guest" : "email";
            req.body.username = auth_utils_1.default.createUsername(req.body.name, method);
            const newUserSchema = req.url === "/guest"
                ? AuthValidator.guestUserSchema
                : AuthValidator.emailUserSchema;
            newUserSchema.parse(req.body);
            return next();
        }
        catch (error) {
            return reponse_controllers_1.default.HandleUnprocessableEntityError(res, error);
        }
    }
    /**
     * Validates the request body for login credentials.
     */
    static validateLoginCredentials(req, res, next) {
        try {
            AuthValidator.loginCredentialsSchema.parse(req.body);
            return next();
        }
        catch (error) {
            return reponse_controllers_1.default.HandleUnprocessableEntityError(res, error);
        }
    }
}
exports.AuthValidator = AuthValidator;
//# sourceMappingURL=auth-validator.js.map