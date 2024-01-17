import { ChatContextType } from "@/contexts/chat-page-context";
import { createContext, useContext } from "react";

// Create the auth context
export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useChatContext = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within an ChatProvider");
  }
  return context;
};
