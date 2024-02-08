"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Represents the schema for a chat message.
 **/
const chatSchema = new mongoose_1.Schema({
    sentBy: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    sentAt: { type: String },
    sentTo: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    isSeen: { type: Boolean, default: false },
    seenAt: { type: String, default: Date.now() },
    repliedTo: { type: String },
    isDeleted: { type: Boolean, default: false },
    data: {
        type: {
            content: { type: String, required: true },
            _type: { type: String, required: true },
            caption: { type: String },
        },
        required: true,
    },
});
const chatsSchema = new mongoose_1.Schema({
    participants: { type: [mongoose_1.default.Schema.Types.ObjectId], default: [] },
    chats: { type: [chatSchema], default: [] },
});
exports.default = mongoose_1.default.model("Chats", chatsSchema);
//# sourceMappingURL=Chat.js.map