import { IAllChats, ILastChat } from "@/types/chat-types";
import { fetchUrl } from "./handler";

export default class ChatHandler {
  public static handleGetLastChats = async (): Promise<ILastChat[]> => {
    return fetchUrl<ILastChat[]>("/chats/last-chats", "GET");
  };

  public static handleGetChatData = async (
    chatId: string
  ): Promise<IAllChats> => {
    return fetchUrl<IAllChats>(`/chats/${chatId}`, "GET");
  };
}
