"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../schema/User"));
const Chat_1 = __importDefault(require("../schema/Chat"));
const reponse_controllers_1 = __importDefault(require("./reponse-controllers"));
/**
 * Controller class for handling chat-related operations.
 */
class ChatController {
    /**
     * Retrieves the last chats for the authenticated user.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to the last chats.
     */
    static async getLastChats(req, res) {
        try {
            const chats = await Chat_1.default.find({ participants: res.locals.jwtData.id });
            // send only last message
            const lastChats = await Promise.all(chats.map(async (chat) => {
                const lastChat = chat.chats[chat.chats.length - 1].toObject();
                const otherUser = chat.participants.filter((participant) => participant.toString() !== res.locals.jwtData.id)[0];
                const user = await User_1.default.findById({ _id: otherUser });
                const unseenMessagesCount = chat.chats.filter((chat) => chat.sentBy.toString() !== res.locals.jwtData.id && !chat.isSeen).length;
                return {
                    lastChat,
                    sentTo: user,
                    unseenMessagesCount,
                };
            }));
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Chats fetched successfully",
                data: lastChats,
            });
        }
        catch (err) {
            return reponse_controllers_1.default.Handle500Error(res, err);
        }
    }
    /**
     * Retrieves all chats based on the provided chatId.
     * Only chats that include the authenticated user will be returned.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns The response with the fetched chat or an error response.
     */
    static async getAllChats(req, res) {
        try {
            const chatId = req.params.chatId;
            const participants = chatId.split("_");
            if (!participants.includes(res.locals.jwtData.id)) {
                return reponse_controllers_1.default.HandleUnauthorizedError(res, []);
            }
            const chat = await Chat_1.default.findOne({
                participants: { $all: participants },
            }).populate("participants");
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Chat fetched successfully",
                data: chat || {
                    participants: participants,
                    chats: [],
                },
            });
        }
        catch (err) {
            return reponse_controllers_1.default.Handle500Error(res, err);
        }
    }
}
exports.default = ChatController;
//# sourceMappingURL=chat-controllers.js.map