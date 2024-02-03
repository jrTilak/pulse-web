import { Router } from "express";
import { verifyToken } from "../utils/token-manager";
import ChatController from "../controllers/chat-controllers";

const chatRouter = Router();

/**
 * @GET - routes
 */

// Get last chats
chatRouter.get("/last-chats", verifyToken, ChatController.getLastChats);
// Get all chats
chatRouter.get("/:chatId", verifyToken, ChatController.getAllChats);

export default chatRouter;
