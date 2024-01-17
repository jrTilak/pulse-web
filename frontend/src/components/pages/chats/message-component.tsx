import FileHandler from "@/handlers/file-handlers";
import { ChatType } from "../../../validators/chat.validator";
import { useAuthContext } from "@/hooks/use-auth";
import { useChatContext } from "@/hooks/use-chat-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import { useInView } from "react-intersection-observer";
import AudioPlayer from "@/components/shared/post/audio-player";
import VideoPlayer from "@/components/shared/post/video-player";
import { Button } from "@/components/ui/button";
import { MdOutlineFileDownload } from "react-icons/md";
import { toast } from "@/hooks/use-toast";
import { FileType } from "@/types/file-types";
type MessageCompProps = {
  chat: ChatType;
  replyingTo: ChatType | null;
};

const MessageComp = ({ chat, replyingTo }: MessageCompProps) => {
  const { currentUser, socket } = useAuthContext();
  const { setLastChats } = useChatContext();
  const isSent = chat.sentBy === currentUser._id;
  const [ref, inView] = useInView({
    threshold: 0.01,
  });

  useEffect(() => {
    if (inView && !chat.isSeen && !isSent) {
      // mark as seen
      socket &&
        socket.emit(
          "mark-as-seen",
          {
            sentBy: chat.sentTo,
            sentTo: chat.sentBy, //this is opposite because we are marking as seen for the other user
            messageId: chat._id,
          },
          (res: any) => {
            if (!res) return;
            setLastChats((prev) => {
              console.log("prev");
              const index = prev.findIndex((c) => c.sentTo._id === chat.sentBy);
              const newChats = [...prev];
              newChats[index].unseenMessagesCount -= 1;
              return newChats;
            });
          }
        );
    }
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      key={chat._id}
      initial={{ opacity: 0, x: isSent ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.random() / 3 }}
      className={cn(
        "flex flex-col gap-1 w-full max-w-[320px] group relative",
        chat.repliedTo ? "border-l-4 border-purple-500" : ""
      )}
    >
      <Message replyingTo={replyingTo} chat={chat} />
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

const Message = ({ chat, replyingTo }: MessageCompProps) => {
  const { currentUser } = useAuthContext();
  const [file, setFile] = useState<FileType | null>(null);
  const isSent = chat.sentBy === currentUser._id;

  useEffect(() => {
    (async () => {
      if (chat.isDeleted) return null;
      if (chat.data._type === "text") return null;
      const res = await FileHandler.getFile(chat.data.content);
      if (!res.success) return null;
      setFile(res.data);
    })();
  }, [chat]);

  const handleFileDownload = async (file: string, fileName: string) => {
    try {
      const link = document.createElement("a");
      link.href = file;
      link.download = fileName + "." + file.split(";")[0].split("/")[1];
      link.click();
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col leading-1.5 border-gray-200 rounded-xl break-words",
        isSent ? "rounded-br-none bg-muted" : "rounded-tl-none bg-purple-100",
        replyingTo &&
          replyingTo?._id === chat._id &&
          "bg-orange-300 animate-pulse",
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
