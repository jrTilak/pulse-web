import ChatHandler from "@/handlers/chat-handlers";
import UserHandler from "@/handlers/user-handlers";
import { useAuthContext } from "@/hooks/use-auth";
import { ChatContext } from "@/hooks/use-chat-context";
import { LastChatType } from "@/types/chat.type";
import { UserType } from "@/types/user.types";
import ChatUtils from "@/utils/chat-utils";
import { ChatType } from "@/validators/chat.validator";
import { ReactNode, useEffect, useState } from "react";
// Define the shape of the Global context

export interface ChatContextType {
  lastChats: LastChatType[];
  setLastChats: React.Dispatch<React.SetStateAction<LastChatType[]>>;
  isTyping: false | string;
}
// Global provider component
export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [lastChats, setLastChats] = useState([] as LastChatType[]);
  const { isLoaded, socket } = useAuthContext();
  const [isTyping, setIsTyping] = useState(false as false | string);

  useEffect(() => {
    const action = async () => {
      if (!socket || !isLoaded) return;
      const res = await ChatHandler.handleGetLastChats();
      if (!res.success) return;
      const lastChats = res.data;
      setLastChats(lastChats);

      //socket listeners
      socket.on("receive-message", async (chat: ChatType): Promise<any> => {
        const isNewChat = !lastChats.some((c) => c.sentTo._id === chat.sentBy);
        if (isNewChat) {
          console.log("new chat");
          const user = await UserHandler.getUserById(chat.sentBy);
          if (!user.success) return;
          setLastChats((prev) => [
            ...prev,
            {
              sentTo: user.data as UserType,
              lastChat: chat,
              unseenMessagesCount: 1,
            },
          ]);
        } else {
          setLastChats((prev) => {
            const index = prev.findIndex((c) => c.sentTo._id === chat.sentBy); // Modify this line
            const newChats = [...prev];
            newChats[index].lastChat = chat;
            newChats[index].unseenMessagesCount += 1;
            return ChatUtils.sortLastChat(newChats);
          });
        }
      });

      socket.on("user-typing", (data: any) => {
        if (data.isTyping) setIsTyping(data.sentBy);
        else setIsTyping(false);
      });
    };
    action();
  }, []);
  const ChatContextValue: ChatContextType = {
    lastChats,
    setLastChats,
    isTyping,
  };

  return (
    <ChatContext.Provider value={ChatContextValue}>
      {children}
    </ChatContext.Provider>
  );
};
