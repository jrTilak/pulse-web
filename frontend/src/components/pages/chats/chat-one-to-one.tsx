import { useParams } from "react-router-dom";
import { ScrollArea } from "../../ui/scroll-area";
import { useAuthContext } from "@/hooks/use-auth";
import { UserType } from "@/types/user.types";
import { ChatType } from "@/validators/chat.validator";
import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "./chat-header";
import NoChatsFound from "./no-chats-found";
import ChatInput from "./chat-input";
import { cn } from "@/lib/utils";
import { height } from "@/assets/constants/styles";
import { useChatContext } from "@/hooks/use-chat-context";
import Loading from "react-loading";
import { motion } from "framer-motion";
import MessageContextWithMenu from "./message-context-menu";
import ChatUtils from "@/utils/chat-utils";
import UserHandler from "@/handlers/user-handlers";
import ChatHandler from "@/handlers/chat-handlers";
import { ArrayUtils } from "@/utils/array-utils";

const ChatsOneToOne = () => {
  const { chatId } = useParams();
  const { currentUser } = useAuthContext();
  const [chattingWith, setChattingWith] = useState({} as UserType);
  const [chats, setChats] = useState([] as ChatType[]);
  const { socket } = useAuthContext();
  const { isTyping } = useChatContext();
  const [replyingTo, setReplyingTo] = useState(null as ChatType | null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const action = async () => {
      setChats([] as ChatType[]);
      const chattingWithUserId = ChatUtils.getUserIdsFromChatId(
        chatId || "",
        currentUser._id
      )?.otherUserId;
      if (chattingWithUserId) {
        const res = await UserHandler.getUserById(chattingWithUserId, [
          "name",
          "isOnline",
          "profileImg",
          "_id",
          "username",
        ]);
        if (!res.success) return;
        setChattingWith(res.data as UserType);

        const res2 = await ChatHandler.handleGetChatData(chatId || "");
        if (!res2.success) return;
        setChats(res2.data.chats);
      }

      if (socket) {
        socket.on("receive-message", (chat: ChatType) => {
          if (
            chat.sentBy === chattingWithUserId &&
            chat.sentTo === currentUser._id
          ) {
            setChats((prevChats) => [...prevChats, chat]);
          }
        });

        socket.on("message-seen", (data: any) => {
          console.log(data);
          if (chatId === ChatUtils.createChatId(data.sentBy, data.sentTo)) {
            setChats((prevChats) => {
              return prevChats.map((chat) => {
                if (chat._id === data.messageId) {
                  return {
                    ...chat,
                    isSeen: true,
                    seenAt: data.seenAt,
                  };
                }
                return chat;
              });
            });
          }
        });
      }
    };
    action();
  }, [chatId, currentUser._id, socket]);

  const handleReplyAMessage = (chat: ChatType | null) => {
    setReplyingTo(chat);
    if (chatInputRef.current && chat) {
      chatInputRef.current.focus();
    }
  };

  useEffect(() => {
    //scroll to bottom
    const scrollArea = document.querySelector("#chat-scroll-area div");
    if (scrollArea) {
      scrollArea.scrollTo({
        left: 0,
        top: scrollArea.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chats, isTyping]);

  useEffect(() => {
    if (socket) {
      socket.on("delete-message", (chat: ChatType) => {
        setChats((prevChats) => {
          const chats = prevChats.filter((c) => c.sentAt !== chat.sentAt);
          return ArrayUtils.sortBySentAt([
            ...chats,
            {
              ...chat,
              isDeleted: true,
            },
          ]);
        });
      });
    }
  }, []);

  return (
    <div className={cn("flex flex-col justify-between w-full", height.max)}>
      <ChatHeader user={chattingWith} />
      <ScrollArea id="chat-scroll-area" className="flex flex-grow p-4 w-full">
        <motion.div className="flex flex-col gap-1">
          {chats.length === 0 ? (
            <NoChatsFound user={chattingWith} />
          ) : (
            chats.map((chat, i) => {
              if (chat.sentBy === chats[i - 1]?.sentBy) {
                return (
                  <MessageContextWithMenu
                    replyingTo={replyingTo}
                    key={chat._id}
                    chat={chat}
                    handleReplyAMessage={handleReplyAMessage}
                    setChats={setChats}
                  />
                );
              }

              return (
                <MessageContextWithMenu
                  replyingTo={replyingTo}
                  setChats={setChats}
                  key={chat.sentAt}
                  chat={chat}
                  handleReplyAMessage={handleReplyAMessage}
                />
              );
            })
          )}
          {isTyping === chattingWith._id && (
            <Loading type="bubbles" color="#6B46C1" height={20} />
          )}
        </motion.div>
      </ScrollArea>
      <ChatInput
        chatInputRef={chatInputRef}
        setChats={setChats}
        chattingWith={chattingWith}
        handleReplyAMessage={handleReplyAMessage}
        replyingTo={replyingTo}
      />
    </div>
  );
};
export default ChatsOneToOne;
