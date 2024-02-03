import { Response, Request } from "express";
import User from "../schema/User";
import Chat from "../schema/Chat";
import ResponseController from "./reponse-controllers";

/**
 * Controller class for handling chat-related operations.
 */
export default class ChatController {
  /**
   * Retrieves the last chats for the authenticated user.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A Promise that resolves to the last chats.
   */
  public static async getLastChats(req: Request, res: Response) {
    try {
      const chats = await Chat.find({ participants: res.locals.jwtData.id });
      // send only last message
      const lastChats = await Promise.all(
        chats.map(async (chat) => {
          const lastChat = chat.chats[chat.chats.length - 1].toObject();
          const otherUser = chat.participants.filter(
            (participant) => participant.toString() !== res.locals.jwtData.id
          )[0];
          const user = await User.findById({ _id: otherUser });
          const unseenMessagesCount = chat.chats.filter(
            (chat) =>
              chat.sentBy.toString() !== res.locals.jwtData.id && !chat.isSeen
          ).length;
          return {
            lastChat,
            sentTo: user,
            unseenMessagesCount,
          };
        })
      );

      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Chats fetched successfully",
        data: lastChats,
      });
    } catch (err) {
      return ResponseController.Handle500Error(res, err);
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
  public static async getAllChats(req: Request, res: Response) {
    try {
      const chatId = req.params.chatId;
      const participants = chatId.split("_");
      if (!participants.includes(res.locals.jwtData.id)) {
        return ResponseController.HandleUnauthorizedError(res, []);
      }
      const chat = await Chat.findOne({
        participants: { $all: participants },
      }).populate("participants");
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Chat fetched successfully",
        data: chat || {
          participants: participants,
          chats: [],
        },
      });
    } catch (err) {
      return ResponseController.Handle500Error(res, err);
    }
  }
}
