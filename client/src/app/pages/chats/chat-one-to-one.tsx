import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import NoChatsFound from "./no-chats-found";
import { height } from "@/assets/constants/styles";
import MessageWithContextMenu from "./message-with-context-menu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ChatHandler from "@/handlers/chat-handlers";
import LoadingPage from "../shared/loading-page";
import { IAllChats } from "@/types/chat-types";
import UserHandler from "@/handlers/user-handlers";
import ChatUtils from "@/utils/chat-utils";
import { IUser } from "@/types/user-types";
import { ChatHeader } from "./chat-header";
import ChatInput from "./chat-input";
import { useEffect, useRef, useState } from "react";
import useSocket from "@/app/providers/socket-provider";
import { ChevronDown } from "lucide-react";
const ChatsOneToOne = () => {
  const { socket } = useSocket();
  const [isScrollDownButtonVisible, setIsScrollDownButtonVisible] =
    useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
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
    socket.on(
      "message-seen",
      (data: {
        sentBy: string;
        sentTo: string;
        messageId: string;
        seenAt: string;
      }) => {
        console.log("seen", data);
        if (chatId === ChatUtils.createChatId(data?.sentBy, data.sentTo)) {
          queryClient.setQueryData<IAllChats>(["chats", chatId], (prev) => {
            const prevChats = prev?.chats || [];
            return {
              ...prev,
              chats: prevChats.map((chat) => {
                if (chat._id === data.messageId) {
                  return { ...chat, isSeen: true, seenAt: data.seenAt };
                }
                return chat;
              }),
            } as IAllChats;
          });
        }
      }
    );
    return () => {
      socket.off("receive-message");
      socket.off("message-seen");
    };
  }, [chatId, chattingWith, currentUser, queryClient, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const scrollToBottom = () => {
    const scrollArea = chatContainerRef.current?.querySelector("div");
    if (scrollArea && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = scrollArea.scrollHeight;
    }
  };

  useEffect(() => {
    const ref = chatContainerRef.current;
    if (ref) {
      ref.addEventListener("scroll", () => {
        const scrollArea = ref?.querySelector("div");
        if (scrollArea && ref) {
          const isScrollDownButtonVisible =
            ref.scrollTop + ref.clientHeight < scrollArea.scrollHeight;
          setIsScrollDownButtonVisible(isScrollDownButtonVisible);
        }
      });
    }
    return () => {
      ref?.removeEventListener("scroll", () => {});
    };
  }, [chatContainerRef]);

  if (isLoading) return <LoadingPage />;
  return (
    <div className={cn("flex flex-col justify-between w-full")}>
      {!isChattingWithLoading && <ChatHeader user={chattingWith as IUser} />}
      <ScrollArea
        ref={chatContainerRef}
        className={cn(
          "flex flex-grow p-4 w-full overflow-y-scroll",
          height.chat,
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
      <AnimatePresence>
        {isScrollDownButtonVisible && (
          <motion.button
            onClick={scrollToBottom}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-20 right-12 rounded-full bg-primary p-2 z-50 flex items-center justify-center"
          >
            <ChevronDown size={24} />
          </motion.button>
        )}
      </AnimatePresence>
      <ChatInput
        chattingWith={chattingWith as IUser}
        // handleReplyAMessage={handleReplyAMessage}
      />
    </div>
  );
};
export default ChatsOneToOne;
