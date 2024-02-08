"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidator = void 0;
const zod_1 = __importDefault(require("zod"));
const reponse_controllers_1 = __importDefault(require("../../controllers/reponse-controllers"));
class PostValidator {
    /**
     * Validates the request body for creating a post.
     */
    static validatePost(req, res, next) {
        const postSchema = zod_1.default.object({
            content: zod_1.default.object({
                text: zod_1.default.string().min(1).max(600),
                images: zod_1.default.array(zod_1.default.string().url()).max(3).optional(),
                imagesLayout: zod_1.default
                    .union([
                    zod_1.default.literal("vertical"),
                    zod_1.default.literal("grid31"),
                    zod_1.default.literal("grid32"),
                ])
                    .optional(),
                video: zod_1.default.string().url().optional(),
                audio: zod_1.default.string().optional(),
            }),
        });
        try {
            postSchema.parse(req.body);
            return next();
        }
        catch (error) {
            return reponse_controllers_1.default.HandleUnprocessableEntityError(res, error);
        }
    }
    /**
     * Validates the draft object in the request body.
     */
    static validateDraft(req, res, next) {
        const draftSchema = zod_1.default.object({
            content: zod_1.default.object({
                text: zod_1.default.string().min(1).max(600),
                images: zod_1.default.array(zod_1.default.string().url()).max(3).optional(),
                imagesLayout: zod_1.default
                    .union([
                    zod_1.default.literal("vertical"),
                    zod_1.default.literal("grid31"),
                    zod_1.default.literal("grid32"),
                ])
                    .optional(),
                video: zod_1.default.string().url().optional(),
                audio: zod_1.default.string().optional(),
            }),
        });
        try {
            draftSchema.parse(req.body);
            return next();
        }
        catch (error) {
            return reponse_controllers_1.default.HandleUnprocessableEntityError(res, error);
        }
    }
    /**
     * Validates the comment object in the request body.
     */
    static validateComment(req, res, next) {
        try {
            const { comment } = req.body;
            const commentSchema = zod_1.default.object({
                content: zod_1.default.string().min(1).max(600),
                createdBy: zod_1.default.string(),
                createdAt: zod_1.default.date().default(() => new Date()),
            });
            commentSchema.parse(comment);
            return next();
        }
        catch (error) {
            return reponse_controllers_1.default.HandleUnprocessableEntityError(res, error);
        }
    }
}
exports.PostValidator = PostValidator;
//# sourceMappingURL=post.validator.js.map