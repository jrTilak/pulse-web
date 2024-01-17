import { ChatTypeExtended, LastChatType } from "@/types/chat.type";
import { ServiceResponseType } from "@/types/handler-response.types";
import { fetchUrl } from "./handler";

export default class ChatHandler {
  public static handleGetLastChats = async (): Promise<
    ServiceResponseType<LastChatType[]>
  > => {
    return fetchUrl<LastChatType[]>("/chats/last", "GET");
  };

  public static handleGetChatData = async (
    chatId: string
  ): Promise<ServiceResponseType<ChatTypeExtended>> => {
    return fetchUrl<ChatTypeExtended>(`/chats/${chatId}`, "GET");
  };
}
