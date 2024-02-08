"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Represents the data schema for a post.
 */
const PostDataSchema = new mongoose_1.default.Schema({
    text: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
    },
    video: {
        type: String,
    },
    audio: {
        type: String,
    },
    imagesLayout: {
        type: String,
    },
});
/**
 * Represents the schema for a comment.
 */
const CommentSchema = new mongoose_1.default.Schema({
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
        required: true,
    },
});
/**
 * Represents the schema for a Post in the application.
 */
exports.PostSchema = new mongoose_1.default.Schema({
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: PostDataSchema,
        required: true,
    },
    likes: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        default: [],
    },
    comments: {
        type: [CommentSchema],
        default: [],
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
});
exports.default = mongoose_1.default.model("Post", exports.PostSchema);
//# sourceMappingURL=Post.js.map