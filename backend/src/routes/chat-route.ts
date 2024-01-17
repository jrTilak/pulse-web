import { Router } from "express";
import { verifyToken } from "../utils/token-manager";
import ChatController from "../controllers/chat-controllers";

const chatRouter = Router();

chatRouter.get("/last-chats", verifyToken, ChatController.getLastChats);
chatRouter.get("/:chatId", verifyToken, ChatController.getAllChats);

export default chatRouter;
