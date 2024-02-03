import { IUser } from "./user-types";

export interface ILastChat {
  _id: string;
  sentTo: IUser;
  lastChat: IChat;
  unseenMessagesCount: number;
}

export interface IChat {
  _id: string;
  sentBy: string;
  sentAt: string;
  sentTo: string;
  isSeen: boolean;
  seenAt: string;
  repliedTo?: string;
  isDeleted: boolean;
  data: {
    content: string;
    _type: string;
    caption: string;
  };
}

export interface IAllChats {
  _id: string;
  participants: string[];
  chats: IChat[];
}
