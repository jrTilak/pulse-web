"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Represents the schema for a user story.
 */
const UserStorySchema = new mongoose_1.default.Schema({
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    type: {
        type: String,
        enum: ["text", "image", "video"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        default: [],
    },
    views: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    storyConfig: {
        type: {
            isBold: Boolean,
            isItalic: Boolean,
            isUnderlined: Boolean,
            fontSize: Number,
            textColor: String,
            backgroundColor: String,
        },
    },
});
exports.default = mongoose_1.default.model("UserStory", UserStorySchema);
//# sourceMappingURL=UserStory.js.map