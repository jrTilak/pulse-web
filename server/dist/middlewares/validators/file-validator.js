"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const reponse_controllers_1 = __importDefault(require("../../controllers/reponse-controllers"));
/**
 * Class representing a FileValidator.
 */
class FileValidator {
    /**
     * Schema for uploading a file.
     */
    static uploadFileSchema = zod_1.default.object({
        content: zod_1.default.string(),
        name: zod_1.default.string().min(1).max(255),
    });
    /**
     * Validates the request body for uploading a file.
     */
    static validateFileToUpload(req, res, next) {
        try {
            FileValidator.uploadFileSchema.parse(req.body);
            return next();
        }
        catch (error) {
            return reponse_controllers_1.default.HandleUnprocessableEntityError(res, error);
        }
    }
}
exports.default = FileValidator;
//# sourceMappingURL=file-validator.js.map