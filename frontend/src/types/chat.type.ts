import { ChatType } from "@/validators/chat.validator";
import { UserType } from "./user.types";

export interface LastChatType {
  sentTo: UserType;
  lastChat: ChatType;
  unseenMessagesCount: number;
}

export interface ChatTypeExtended {
  participants: string[];
  _id: string;
  chats: ChatType[];
}
