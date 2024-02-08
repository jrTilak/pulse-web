"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Represents the schema for the private information of a user.
 * @remarks The data in this schema is private and is not shared with other users.
 */
const UserPrivateInfo = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        unique: true,
    },
    following: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        default: [],
    },
    followers: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        default: [],
    },
    savedPosts: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        default: [],
    },
    connectedUsers: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        default: [],
    },
}, {
    collection: "UserPrivateInfo",
});
exports.default = mongoose_1.default.model("UserPrivateInfo", UserPrivateInfo);
//# sourceMappingURL=UserPrivateInfo.js.map