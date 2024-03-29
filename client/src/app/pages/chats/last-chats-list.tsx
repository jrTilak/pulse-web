import StoriesList from "@/app/components/stories/stories-list";
import SearchBar from "./search-bar";
import { cn } from "@/lib/utils";
import { Link, useLocation, useParams } from "react-router-dom";
import NewChatButton from "./new-chat-button";
import { useEffect, useState } from "react";
import { height } from "@/assets/constants/styles";
import Loading from "react-loading";
import ChatUtils from "@/utils/chat-utils";
import DateUtils from "@/utils/date-utils";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IUser } from "@/types/user-types";
import { IAllChats, IChat, ILastChat } from "@/types/chat-types";
import ChatHandler from "@/handlers/chat-handlers";
import useSocket from "@/app/providers/socket-provider";
import UserHandler from "@/handlers/user-handlers";
import UserImageOnly from "@/app/components/avatars/user-image-only";
import { LuArrowLeftFromLine } from "react-icons/lu";
const LastChatsList = () => {
  const [isVisibile, setIsVisible] = useState(false);
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const { data: lastChats } = useQuery<ILastChat[]>({
    queryKey: ["lastChats"],
    queryFn: ChatHandler.handleGetLastChats,
  });
  const { chatId } = useParams<{ chatId: string }>();

  const { data: currentUser } = useQuery<IUser>({ queryKey: ["currentUser"] });

  const { data: chattingWith } = useQuery({
    queryKey: ["chattingWith", chatId],
    queryFn: () => {
      const users = ChatUtils.getUserIdsFromChatId(
        chatId as string,
        currentUser?._id as string
      );
      return UserHandler.getUserById(users?.otherUserId as string);
    },
  });

  const { pathname } = useLocation();
  useEffect(() => {
    setIsVisible(pathname === "/chats");
  }, [pathname]);

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

  useEffect(() => {
    if (!socket) return;
    socket.on("receive-message", (chat: IChat) => {
      const isNew = ChatUtils.isNewChat({
        lastChats: lastChats || [],
        message: chat,
      });
      if (!isNew.isNewChat) {
        queryClient.setQueryData<ILastChat[]>(["lastChats"], (prev) => {
          if (!prev) return [];
          return prev.map((c, i) => {
            if (i === isNew.index) {
              return {
                ...c,
                lastChat: chat,
                unseenMessagesCount: c.unseenMessagesCount + 1,
              };
            }
            return c;
          });
        });
        if (
          pathname.length > 10 &&
          chat.sentBy === chattingWith?._id &&
          chat.sentTo === currentUser?._id
        ) {
          console.log("received message to set", chat);
          queryClient.setQueryData<IAllChats>(["chats", chatId], (prev) => {
            const prevChats = prev?.chats || [];
            return {
              ...prev,
              chats: [...prevChats, chat],
            } as IAllChats;
          });
        }
      } else {
        UserHandler.getUserById(chat.sentBy).then((user) => {
          queryClient.setQueryData<ILastChat[]>(["lastChats"], (prev) => {
            if (!prev) return [];
            return [
              {
                _id: chat._id,
                sentTo: user as IUser,
                lastChat: chat,
                unseenMessagesCount: 1,
              },
              ...prev,
            ];
          });
        });
      }
    });
    return () => {
      socket.off("receive-message");
    };
  }, [
    chatId,
    chattingWith?._id,
    currentUser?._id,
    lastChats,
    pathname.length,
    queryClient,
    socket,
  ]);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:max-w-[380px] max-w-none min-w-[380px] p-6 bg-muted w-full",
        isVisibile ? "" : "hidden md:flex",
        height.max,
        pathname.startsWith("/chat") ? "h-[100svh]" : ""
      )}
    >
      <div className="flex justify-between">
        <div className="flex gap-3 items-center justify-center">
          <Link to="/" className="flex gap-3 items-center md:hidden">
            <LuArrowLeftFromLine className="text-xl text-foreground" />
            <span className="text-xl font-semibold text-foreground">Home</span>
          </Link>
          <Link
            to="/chats"
            className="text-2xl font-semibold text-foreground hidden md:block"
          >
            Chats
          </Link>
        </div>
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
          {ChatUtils.sortLastChats(lastChats || [])?.map((chat, i) => (
            <AvatarWithMessage chat={chat} key={i} />
          ))}
          {lastChats?.length === 0 && (
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

const AvatarWithMessage = ({ chat }: { chat: ILastChat }) => {
  const isTyping = "";
  const { data: currentUser } = useQuery<IUser>({ queryKey: ["currentUser"] });
  const { pathname } = useLocation();
  return (
    <Link
      to={`/chats/${ChatUtils.createChatId(
        chat.sentTo._id,
        currentUser?._id || ""
      )}`}
      className={cn(
        "w-full px-4 py-2 transition-all rounded hover:bg-gray-200",
        pathname ===
          `/chats/${ChatUtils.createChatId(
            chat.sentTo._id,
            currentUser?._id || ""
          )}` && "bg-gray-200",
        chat.unseenMessagesCount > 0
          ? "bg-purple-200 text-foreground"
          : "text-muted-foreground"
      )}
    >
      <div className="relative flex items-center gap-2 ">
        <UserImageOnly
          img={chat.sentTo.profileImg}
          name={chat.sentTo.name}
          isOnline={chat.sentTo.isOnline}
        />
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
                {chat.lastChat.sentBy === currentUser?._id && "You: "}
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
