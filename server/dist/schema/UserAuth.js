"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Represents the schema for user authentication.
 * @remarks The data in this schema is used for authentication purposes.
 */
const UserAuthSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        unique: true,
    },
    method: {
        type: ["guest", "email", "google"],
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
    },
    password: {
        type: String,
        min: 8,
        max: 20,
    },
}, {
    collection: "UserAuth",
});
exports.default = mongoose_1.default.model("UserAuth", UserAuthSchema);
//# sourceMappingURL=UserAuth.js.map