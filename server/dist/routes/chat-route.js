"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const token_manager_1 = require("../utils/token-manager");
const chat_controllers_1 = __importDefault(require("../controllers/chat-controllers"));
const chatRouter = (0, express_1.Router)();
/**
 * @GET - routes
 */
// Get last chats
chatRouter.get("/last-chats", token_manager_1.verifyToken, chat_controllers_1.default.getLastChats);
// Get all chats
chatRouter.get("/:chatId", token_manager_1.verifyToken, chat_controllers_1.default.getAllChats);
exports.default = chatRouter;
//# sourceMappingURL=chat-route.js.map