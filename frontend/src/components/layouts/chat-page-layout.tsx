import { ChatContextProvider } from "@/contexts/chat-page-context";
import LastChatsList from "../pages/chats/last-chats-list";

const ChatPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChatContextProvider>
      <div className="flex md:ml-4 h-full w-full">
        <div className="flex w-full">
          <LastChatsList />
          {children}
        </div>
      </div>
    </ChatContextProvider>
  );
};
export default ChatPageLayout;
