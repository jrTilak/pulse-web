import StoriesList from "@/components/shared/stories/stories-list";
import SearchBar from "./search-bar";
import UserAvatar from "@/components/shared/avatars/user-avatar";
import { useAuthContext } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import NewChatButton from "./new-chat-button";
import { LastChatType } from "@/types/chat.type";
import { useEffect, useState } from "react";
import usePathname from "@/hooks/use-pathname";
import { height } from "@/assets/constants/styles";
import { UserType } from "@/types/user.types";
import { useChatContext } from "@/hooks/use-chat-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loading from "react-loading";
import ChatUtils from "@/utils/chat-utils";
import DateUtils from "@/utils/date-utils";

const LastChatsList = () => {
  const [isVisibile, setIsVisible] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setIsVisible(pathname === "/chats");
  }, [pathname]);
  const { lastChats } = useChatContext();

  useEffect(() => {
    const lastChatsScrollArea = document.getElementById(
      "last-chats-scroll-area div"
    );
    if (lastChatsScrollArea) {
      lastChatsScrollArea.scrollBy({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [lastChats]);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:max-w-[380px] max-w-none min-w-[380px] p-6 bg-muted w-full",
        isVisibile ? "" : "hidden md:flex",
        height.max
      )}
    >
      <div className="flex justify-between">
        <Link to="/chats" className="text-2xl font-semibold text-foreground">
          Chats
        </Link>
        <NewChatButton />
      </div>
      <SearchBar />
      {
        // userstories
        <div className="flex gap-4 overflow-hidden p-4">
          <StoriesList />
        </div>
      }
      <span className="mt-2 text-sm font-semibold text-muted-foreground">
        Recent
      </span>
      <ScrollArea id="last-chats-scroll-area" className="w-full">
        <div className="flex flex-col gap-4 mt-2">
          {lastChats.map((chat, i) => (
            <AvatarWithMessage chat={chat} key={i} />
          ))}
          {lastChats.length === 0 && (
            <span className="flex flex-grow m-auto text-sm font-semibold text-muted-foreground">
              No recent chats
            </span>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
export default LastChatsList;

const UserAvatarInChat = ({ user }: { user: UserType }) => {
  return (
    <div className="relative">
      <UserAvatar user={user} className="w-12 h-12" />
      <span
        className={cn(
          "bottom-0 left-7 absolute  w-3.5 h-3.5 border-2 border-background rounded-full",
          user.isOnline ? "bg-green-500" : "bg-gray-500"
        )}
      />
    </div>
  );
};

const AvatarWithMessage = ({ chat }: { chat: LastChatType }) => {
  const { isTyping } = useChatContext();
  const { currentUser } = useAuthContext();
  const pathname = usePathname();
  return (
    <Link
      to={`/chats/${ChatUtils.createChatId(chat.sentTo._id, currentUser._id)}`}
      className={cn(
        "w-full px-4 py-2 transition-all rounded hover:bg-gray-200",
        pathname ===
          `/chats/${ChatUtils.createChatId(chat.sentTo._id, currentUser._id)}` &&
          "bg-gray-200",
        chat.unseenMessagesCount > 0
          ? "bg-purple-200 text-foreground"
          : "text-muted-foreground"
      )}
    >
      <div className="relative flex items-center gap-2 ">
        <UserAvatarInChat user={chat.sentTo} />
        <div className="flex-grow overflow-hidden">
          <h5 className="mb-1 text-base truncate">{chat.sentTo.name}</h5>
          <p className="mb-0 text-xs truncate overflow-hidden text-ellipsis">
            {isTyping === chat.sentTo._id ? (
              <>
                <Loading
                  type="bubbles"
                  color="#6B46C1"
                  width={20}
                  height={20}
                />
              </>
            ) : (
              <>
                {chat.lastChat.sentBy === currentUser._id && "You: "}
                {chat.lastChat.data.content.length > 30
                  ? chat.lastChat.data.content.substring(0, 25) + "..."
                  : chat.lastChat.data.content}
              </>
            )}
          </p>
        </div>
        <div className="relative text-xs text-gray-500 -top-2 text-11 dark:text-gray-300">
          {DateUtils.getTimeElapsed(chat.lastChat.sentAt)}
        </div>
        {chat.unseenMessagesCount > 0 && (
          <div className="absolute bottom-0 right-0">
            <span className="px-2 py-1 text-[0.5rem] text-red-500 rounded-full bg-red-500/20">
              {chat.unseenMessagesCount}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};
