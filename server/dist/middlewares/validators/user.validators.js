"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const reponse_controllers_1 = __importDefault(require("../../controllers/reponse-controllers"));
class UserValidator {
    /**
     * Validates the request body for editing user details.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    static validateEditUserDetails = (req, res, next) => {
        const EditUserDetailsSchema = zod_1.default.object({
            name: zod_1.default.string().min(3).max(40).optional(),
            username: zod_1.default.string().min(3).max(40).optional(),
            profileImg: zod_1.default.string().default("").optional(),
            coverImg: zod_1.default.string().default("").optional(),
            bio: zod_1.default.string().default("").optional(),
            updatedAt: zod_1.default
                .string()
                .default(() => new Date().toISOString())
                .optional(),
            lastSeen: zod_1.default
                .string()
                .default(() => new Date().toISOString())
                .optional(),
            isOnline: zod_1.default.boolean().default(false).optional(),
        });
        try {
            const body = req.body;
            EditUserDetailsSchema.parse(body);
            next();
        }
        catch (error) {
            return reponse_controllers_1.default.HandleUnprocessableEntityError(res, error);
        }
    };
}
exports.default = UserValidator;
//# sourceMappingURL=user.validators.js.map