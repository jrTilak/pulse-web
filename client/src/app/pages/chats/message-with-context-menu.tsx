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
} from "@/app/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { IoCheckmarkDone } from "react-icons/io5";
import { Flag, Pin, Trash } from "lucide-react";
import { FaRegCopy } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { BsReply } from "react-icons/bs";
import { SlActionRedo } from "react-icons/sl";
import FileHandler from "@/handlers/file-handlers";
import { IChat } from "@/types/chat-types";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/types/user-types";
import MessageComp from "./messsage-component";
export default function MessageWithContextMenu({ chat }: { chat: IChat }) {
  const { data: currentUser } = useQuery<IUser>({
    queryKey: ["currentUser"],
  });
  const handleCopyText = () => {
    try {
      navigator.clipboard.writeText(chat.data.content);
      toast.success("Text copied to clipboard");
    } catch (e) {
      toast.error("Failed to copy text to clipboard");
    }
  };
  const handleReportMessage = () => {
    setTimeout(() => {
      toast.success("Thank you for reporting the message");
    }, 1000);
  };

  const handleFileDownload = async (_id: string) => {
    FileHandler.getFile(_id)
      .then((file) => {
        const base64File = file.content;
        const link = document.createElement("a");
        link.href = base64File;
        link.download = file.name;
        link.click();
      })
      .catch(() => {
        toast.error("Failed to download file");
      });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger
        id={chat._id}
        className={cn(
          "w-[320px] block cursor-pointer",
          chat.sentBy === currentUser?._id ? "self-end mr-6" : "self-start"
        )}
      >
        <MessageComp chat={chat} />
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52 mb-6">
        <ContextMenuItem>
          Reply
          <ContextMenuShortcut>
            <BsReply className="w-4 h-4" />
          </ContextMenuShortcut>
        </ContextMenuItem>
        {chat.sentBy === currentUser?._id ? (
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
        {chat.sentBy === currentUser?._id ? (
          <>
            {!chat.isDeleted && (
              <ContextMenuItem 
            //   onClick={handleUnSendMessage}
              >
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
