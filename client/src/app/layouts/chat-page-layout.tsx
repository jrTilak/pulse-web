import { cn } from "@/lib/utils";
import LastChatsList from "../pages/chats/last-chats-list";
import { useLocation } from "react-router-dom";

const ChatPageLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  return (
    <div
      className={cn(
        "flex md:ml-4 h-full w-full",
        pathname.startsWith("/chats") ? "h-[100svh]" : ""
      )}
    >
      <div className="flex w-full">
        <LastChatsList />
        {children}
      </div>
    </div>
  );
};
export default ChatPageLayout;
