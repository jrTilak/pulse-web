import FileHandler from "@/handlers/file-handlers";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import AudioPlayer from "@/app/components/post/audio-player";
import VideoPlayer from "@/app/components/post/video-player";
import { Button } from "@/app/components/ui/button";
import { MdOutlineFileDownload } from "react-icons/md";
import { IChat, ILastChat } from "@/types/chat-types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IUser } from "@/types/user-types";
import { IFile } from "@/types/file-types";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";
import useSocket from "@/app/providers/socket-provider";
import ChatUtils from "@/utils/chat-utils";
type MessageCompProps = {
  chat: IChat;
};

const MessageComp = ({ chat }: MessageCompProps) => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const { data: currentUser } = useQuery<IUser>({
    queryKey: ["currentUser"],
  });
  const [ref, inView] = useInView({
    threshold: 0.01,
  });
  const isSent = chat.sentBy === currentUser?._id;

  useEffect(() => {
    if (inView && !chat.isSeen && !isSent) {
      // mark as seen
      console.log("marking as seen");
      socket &&
        socket.emit(
          "mark-as-seen",
          {
            sentBy: chat.sentTo,
            sentTo: chat.sentBy, //this is opposite because we are marking as seen for the other user
            messageId: chat._id,
          },
          (res: unknown) => {
            if (!res) return;
            queryClient.setQueryData<ILastChat[]>(["lastChats"], (prev) => {
              return prev?.map((c) => {
                const chatId = ChatUtils.createChatId(chat.sentBy, chat.sentTo);
                const lChatId = ChatUtils.createChatId(
                  c.lastChat.sentBy,
                  c.lastChat.sentTo
                );
                if (chatId === lChatId) {
                  return {
                    ...c,
                    isSeen: true,
                    unseenMessagesCount: c.unseenMessagesCount - 1,
                  };
                }
                return c;
              });
            });
          }
        );
    }
  }, [
    chat._id,
    chat.isSeen,
    chat.sentBy,
    chat.sentTo,
    inView,
    isSent,
    queryClient,
    socket,
  ]);

  return (
    <motion.div
      ref={ref}
      key={chat._id}
      initial={{ opacity: 0, x: isSent ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.random() / 5 }}
      className={cn(
        "flex flex-col gap-1 w-full max-w-[320px] group relative",
        chat.repliedTo ? "border-l-4 border-purple-500" : ""
      )}
    >
      <Message chat={chat} />
      {chat.isSeen && (
        <div className="absolute bottom-0 right-0 mb-2 mr-2 text-[0.6rem] flex gap-2 items-center">
          {new Date(chat.seenAt || "")
            .toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
            .replace("AM", "")
            .replace("PM", "")}
          <IoCheckmarkDone />
        </div>
      )}
    </motion.div>
  );
};
export default MessageComp;

const Message = ({ chat }: MessageCompProps) => {
  const { data: currentUser } = useQuery<IUser>({ queryKey: ["currentUser"] });
  const [file, setFile] = useState<IFile | null>(null);
  const isSent = chat.sentBy === currentUser?._id;

  useEffect(() => {
    (async () => {
      if (chat.isDeleted) return null;
      if (chat.data._type === "text") return null;
      FileHandler.getFile(chat.data.content)
        .then((f) => setFile(f))
        .catch();
    })();
  }, [chat]);

  const handleFileDownload = async (file: string, fileName: string) => {
    try {
      const link = document.createElement("a");
      link.href = file;
      link.download = fileName + "." + file.split(";")[0].split("/")[1];
      link.click();
    } catch (e) {
      toast.error("Failed to download file");
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col leading-1.5 border-gray-200 rounded-xl break-words",
        isSent ? "rounded-br-none bg-muted" : "rounded-tl-none bg-purple-100",
        chat.isDeleted
          ? (isSent ? "border-l-4" : "border-r-4") +
              " border-slate-500 opacity-60"
          : "",
        chat.data._type === "text" || chat.data.caption || chat.isDeleted
          ? "p-4"
          : "p-0"
      )}
    >
      {chat.isDeleted ? (
        <p className="text-sm font-normal text-muted-foreground">
          {" "}
          This message was deleted{" "}
        </p>
      ) : (
        <>
          {chat.data._type === "text" && (
            <p className="text-sm font-normal text-gray-900">
              {" "}
              {chat.data.content}{" "}
            </p>
          )}
          {chat.data._type !== "text" && (
            <>
              {chat.data.caption && (
                <p className="text-sm font-normal text-gray-900 mb-4">
                  {" "}
                  {chat.data.caption}{" "}
                </p>
              )}
              {chat.data._type === "image" && (
                <img
                  className="w-full h-full rounded-xl"
                  src={file?.content || ""}
                  alt=""
                />
              )}
              {chat.data._type === "video" && (
                <VideoPlayer video={file?.content || ""} />
              )}
              {chat.data._type === "audio" && (
                <AudioPlayer audio={file?.content || ""} />
              )}
              {chat.data._type === "file" && (
                <div
                  onClick={() => {
                    handleFileDownload(
                      file?.content || "",
                      file?.name ||
                        chat.data._type +
                          "_pule_" +
                          Math.floor(Number(Math.random()) * 1000)
                    );
                  }}
                  className="flex gap-2 items-center text-muted-foreground shadow-inner bg-muted rounded-md p-4"
                >
                  <Button variant="secondary">
                    <MdOutlineFileDownload className="w-6 h-6" />
                  </Button>
                  <p>{file?.name || "No preview available"}</p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
