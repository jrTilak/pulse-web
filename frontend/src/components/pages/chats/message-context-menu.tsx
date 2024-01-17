import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import MessageComp from "./message-component";
import ChatValidator, { ChatType } from "@/validators/chat.validator";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/hooks/use-auth";
import { IoCheckmarkDone } from "react-icons/io5";
import { Flag, Pin, Trash } from "lucide-react";
import { FaRegCopy } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { BsReply } from "react-icons/bs";
import { SlActionRedo } from "react-icons/sl";
import { toast } from "@/hooks/use-toast";
import FileHandler from "@/handlers/file-handlers";
import { ArrayUtils } from "@/utils/array-utils";
export default function MessageContextWithMenu({
  chat,
  handleReplyAMessage,
  replyingTo,
  setChats,
}: {
  chat: ChatType;
  handleReplyAMessage: (chat: ChatType | null) => void;
  replyingTo: ChatType | null;
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
}) {
  const { currentUser } = useAuthContext();
  const { socket } = useAuthContext();

  const handleUnSendMessage = async () => {
    const data = ChatValidator.validateChat({ ...chat, isDeleted: true });
    if (!data.success) {
      console.log(data.error);
      toast({
        title: "Error",
        description: "Enter a valid message.",
        variant: "destructive",
      });
      return;
    }
    if (socket) {
      socket.emit("delete-message", data.data, async (_id: string) => {
        console.log(_id);
        if (!_id)
          return toast({
            title: "Error",
            description: "Failed to delete message, try again later",
            variant: "destructive",
          });
        setChats((prevChats) => {
          const chats = prevChats.filter((chat) => chat._id !== _id);
          return ArrayUtils.sortBySentAt([
            ...chats,
            {
              ...chat,
              isDeleted: true,
            },
          ]);
        });
      });
    } else {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleCopyText = () => {
    try {
      navigator.clipboard.writeText(chat.data.content);
      toast({
        title: "Copied",
        description: "Text copied to clipboard",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };
  const handleReportMessage = () => {
    setTimeout(() => {
      toast({
        title: "Reported",
        description: "Message reported successfully",
      });
    }, 1000);
  };

  const handleFileDownload = async (_id: string) => {
    try {
      const res = await FileHandler.getFile(_id);
      if (!res.success)
        return toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      const base64File = res.data.content;
      const link = document.createElement("a");
      link.href = base64File;
      link.download = res.data.name;
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
    <ContextMenu>
      <ContextMenuTrigger
        id={chat._id}
        className={cn(
          "w-[320px] block cursor-pointer",
          chat.sentBy === currentUser._id ? "self-end mr-6" : "self-start"
        )}
      >
        <MessageComp replyingTo={replyingTo} chat={chat} />
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52 mb-6">
        <ContextMenuItem onClick={() => handleReplyAMessage(chat)}>
          Reply
          <ContextMenuShortcut>
            <BsReply className="w-4 h-4" />
          </ContextMenuShortcut>
        </ContextMenuItem>
        {chat.sentBy === currentUser._id ? (
          <ContextMenuSub>
            <ContextMenuSubTrigger>Message Info</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-40">
              <ContextMenuItem className="flex gap-2 items-center justify-start">
                <IoCheckmarkDone />
                <span>
                  Sent at{" "}
                  {new Date(chat.sentAt).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </ContextMenuItem>
              <ContextMenuItem className="flex gap-2 items-center justify-start">
                {chat.isSeen ? (
                  <>
                    <IoCheckmarkDone />
                    <span>
                      Seen at{" "}
                      {new Date(chat.seenAt || "").toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </>
                ) : (
                  <>
                    <IoCheckmarkDone className="opacity-40 text-muted-foreground" />
                    <span className="text-muted-foreground">Not seen yet!</span>
                  </>
                )}
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        ) : (
          <ContextMenuItem>
            <span>
              Recieved at{" "}
              {new Date(chat.sentAt).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
            <ContextMenuShortcut>
              <IoCheckmarkDone />
            </ContextMenuShortcut>
          </ContextMenuItem>
        )}
        <ContextMenuItem disabled>
          Forward
          <ContextMenuShortcut>
            <SlActionRedo />
          </ContextMenuShortcut>
        </ContextMenuItem>

        {!chat.isDeleted && (
          <>
            {chat.data._type === "text" && (
              <ContextMenuItem onClick={handleCopyText}>
                Copy text
                <ContextMenuShortcut>
                  <FaRegCopy />
                </ContextMenuShortcut>
              </ContextMenuItem>
            )}
            {chat.data._type !== "text" && (
              <ContextMenuItem
                onClick={() => {
                  handleFileDownload(chat.data.content);
                }}
              >
                Download {chat.data._type}
                <ContextMenuShortcut>
                  <MdOutlineFileDownload />
                </ContextMenuShortcut>
              </ContextMenuItem>
            )}
          </>
        )}

        <ContextMenuItem>
          Pin message
          <ContextMenuShortcut>
            <Pin className="w-3.5 h-3.5" />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        {chat.sentBy === currentUser._id ? (
          <>
            {!chat.isDeleted && (
              <ContextMenuItem onClick={handleUnSendMessage}>
                Delete message
                <ContextMenuShortcut>
                  <Trash className="w-3.5 h-3.5 text-destructive" />
                </ContextMenuShortcut>
              </ContextMenuItem>
            )}
          </>
        ) : (
          <ContextMenuItem onClick={handleReportMessage}>
            Report message
            <ContextMenuShortcut>
              <Flag className="w-3.5 h-3.5 text-destructive" />
            </ContextMenuShortcut>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
