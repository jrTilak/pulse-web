"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Represents the schema for the DraftData collection.
 */
const DraftDataSchema = new mongoose_1.default.Schema({
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
 * Represents the schema for a draft.
 */
exports.DraftSchema = new mongoose_1.default.Schema({
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
        type: DraftDataSchema,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Draft", exports.DraftSchema);
//# sourceMappingURL=Draft.js.map