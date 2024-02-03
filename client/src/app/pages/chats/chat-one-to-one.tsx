import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { motion } from "framer-motion";
import NoChatsFound from "./no-chats-found";
import { height } from "@/assets/constants/styles";
import MessageWithContextMenu from "./message-with-context-menu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ChatHandler from "@/handlers/chat-handlers";
import LoadingPage from "../shared/loading-page";
import { IAllChats, IChat } from "@/types/chat-types";
import UserHandler from "@/handlers/user-handlers";
import ChatUtils from "@/utils/chat-utils";
import { IUser } from "@/types/user-types";
import { ChatHeader } from "./chat-header";
import ChatInput from "./chat-input";
import { useEffect } from "react";
import useSocket from "@/app/providers/socket-provider";
const ChatsOneToOne = () => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { chatId } = useParams<{ chatId: string }>();
  const { data: currentUser } = useQuery<IUser>({ queryKey: ["currentUser"] });
  const { data: chats, isLoading } = useQuery<IAllChats>({
    queryKey: ["chats", chatId],
    queryFn: () => {
      return ChatHandler.handleGetChatData(chatId as string);
    },
  });

  const { data: chattingWith, isLoading: isChattingWithLoading } = useQuery({
    queryKey: ["chattingWith", chatId],
    queryFn: () => {
      const users = ChatUtils.getUserIdsFromChatId(
        chatId as string,
        currentUser?._id as string
      );
      return UserHandler.getUserById(users?.otherUserId as string);
    },
  });

  useEffect(() => {
    if (!socket || !chattingWith || !currentUser) return;
    socket.on("receive-message", (chat: IChat) => {
      if (
        chat.sentBy === chattingWith?._id &&
        chat.sentTo === currentUser?._id
      ) {
        queryClient.setQueryData<IAllChats>(["chats", chatId], (prev) => {
          const prevChats = prev?.chats || [];
          return {
            ...prev,
            chats: [...prevChats, chat],
          } as IAllChats;
        });
      }
    });

    socket.on("message-seen", (data: IChat) => {
      if (chatId === ChatUtils.createChatId(data?.sentBy, data.sentTo)) {
        queryClient.setQueryData<IAllChats>(["chats", chatId], (prev) => {
          const prevChats = prev?.chats || [];
          return {
            ...prev,
            chats: prevChats.map((chat) => {
              if (chat.sentAt === data.sentAt) {
                return { ...chat, isSeen: true };
              }
              return chat;
            }),
          } as IAllChats;
        });
      }
    });
    return () => {
      socket.off("receive-message");
      socket.off("message-seen");
    };
  }, [chatId, chattingWith, currentUser, queryClient, socket]);

  useEffect(() => {
    //scroll to bottom
    const scrollArea = document.querySelector("#chat-scroll-area");
    if (scrollArea) {
      scrollArea.scrollTo({
        left: 0,
        top: scrollArea.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chats]);

  if (isLoading) return <LoadingPage />;
  return (
    <div className={cn("flex flex-col justify-between w-full")}>
      {!isChattingWithLoading && <ChatHeader user={chattingWith as IUser} />}
      <ScrollArea
        id="chat-scroll-area"
        className={cn(
          "flex flex-grow p-4 w-full overflow-y-scroll",
          height.chat
        )}
      >
        <motion.div className="flex flex-col gap-1 w-full h-full">
          {chats?.chats.length === 0 ? (
            <NoChatsFound user={chattingWith as IUser} />
          ) : (
            chats?.chats.map((chat, i) => {
              if (chat.sentBy === chats.chats[i - 1]?.sentBy) {
                return (
                  <MessageWithContextMenu
                    key={chat._id}
                    chat={chat}
                    // handleReplyAMessage={handleReplyAMessage}
                  />
                );
              }

              return (
                <MessageWithContextMenu
                  key={chat.sentAt}
                  chat={chat}
                  //   handleReplyAMessage={handleReplyAMessage}
                />
              );
            })
          )}
        </motion.div>
      </ScrollArea>
      <ChatInput
        chattingWith={chattingWith as IUser}
        // handleReplyAMessage={handleReplyAMessage}
      />
    </div>
  );
};
export default ChatsOneToOne;
