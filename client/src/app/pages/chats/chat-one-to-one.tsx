import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { motion } from "framer-motion";
import NoChatsFound from "./no-chats-found";
import { height } from "@/assets/constants/styles";
import MessageWithContextMenu from "./message-with-context-menu";
import { useQuery } from "@tanstack/react-query";
import ChatHandler from "@/handlers/chat-handlers";
import LoadingPage from "../shared/loading-page";
import { IAllChats } from "@/types/chat-types";
import UserHandler from "@/handlers/user-handlers";
import ChatUtils from "@/utils/chat-utils";
import { IUser } from "@/types/user-types";
import { ChatHeader } from "./chat-header";
import ChatInput from "./chat-input";
const ChatsOneToOne = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { data: currentUser } = useQuery<IUser>({ queryKey: ["currentUser"] });
  const { data: chats, isLoading } = useQuery<IAllChats>({
    queryKey: ["chats"],
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
      console.log("otherUserId", users);
      return UserHandler.getUserById(users?.otherUserId as string);
    },
  });

  if (isLoading) return <LoadingPage />;
  return (
    <div className={cn("flex flex-col justify-between w-full", height.max)}>
      {!isChattingWithLoading && <ChatHeader user={chattingWith as IUser} />}
      <ScrollArea id="chat-scroll-area" className="flex flex-grow p-4 w-full">
        <motion.div className="flex flex-col gap-1">
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
