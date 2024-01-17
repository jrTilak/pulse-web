import { TfiClip } from "react-icons/tfi";
import { IoImageOutline } from "react-icons/io5";
import { Button } from "../../ui/button";
import { IoSend } from "react-icons/io5";
import { Input } from "../../ui/input";
import React, { useState } from "react";
import ChatValidator, { ChatType } from "../../../validators/chat.validator";
import { UserType } from "@/types/user.types";
import { useAuthContext } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { useChatContext } from "@/hooks/use-chat-context";
import { RxCross2 } from "react-icons/rx";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "react-loading";
import { MdMicNone } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FileHandler from "@/handlers/file-handlers";
import VoiceMessageInput from "./voice-message-input";
import UserHandler from "@/handlers/user-handlers";
import ChatUtils from "@/utils/chat-utils";

const ChatInput = ({
  setChats,
  chattingWith,
  handleReplyAMessage,
  replyingTo,
  chatInputRef,
}: {
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
  chattingWith: UserType;
  handleReplyAMessage: (chat: ChatType | null) => void;
  replyingTo: ChatType | null;
  chatInputRef: React.RefObject<HTMLInputElement>;
}) => {
  const { socket, currentUser } = useAuthContext();
  const [chatTextVal, setChatTextVal] = useState("");
  const [isMessageSending, setIsMessageSending] = useState(false);
  const { lastChats, setLastChats } = useChatContext();
  const [isCaptionOpen, setIsCaptionOpen] = useState(false);
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null); // for file upload [optional
  const [caption, setCaption] = useState("");
  const [isVoiceMessageInputOpen, setIsVoiceMessageInputOpen] = useState(false);

  const handleSendMessage = async ({
    content,
    _type,
    caption,
  }: {
    content: string;
    _type: string;
    caption?: string;
  }) => {
    if (!content || isMessageSending) return false;
    setIsMessageSending(true);
    const data = ChatValidator.validateChat({
      data: {
        content: content.trim(),
        _type: _type as "text" | "image" | "video" | "audio" | "file",
        caption,
      },
      sentBy: currentUser._id,
      sentTo: chattingWith._id,
      sentAt: new Date().toISOString(),
      isSeen: false,
      isDeleted: false,
    });
    if (!data.success) {
      toast({
        title: "Error",
        description: "Enter a valid message",
        variant: "destructive",
      });
      setIsMessageSending(false);
      return false;
    }
    if (!socket) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      setIsMessageSending(false);
      return false;
    }
    socket.emit("send-message", data.data, async (chat: ChatType) => {
      if (!chat) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
        setIsMessageSending(false);
        return false;
      }
      setChats((prevChats) => [...prevChats, chat]);
      const isNewChat = !lastChats.some((c) => c.sentTo._id === chat.sentTo);
      if (isNewChat) {
        const user = await UserHandler.getUserById(chat.sentTo);
        if (!user.success) return false;
        setLastChats((prev) => [
          ...prev,
          {
            sentTo: user.data as UserType,
            lastChat: chat,
            unseenMessagesCount: 1,
          },
        ]);
      } else {
        setLastChats((prev) => {
          const index = prev.findIndex((c) => c.sentTo._id === chat.sentTo); // Modify this line
          const newChats = [...prev];
          newChats[index].lastChat = chat;
          newChats[index].unseenMessagesCount += 1;
          return ChatUtils.sortLastChat(newChats);
        });
      }
      setIsMessageSending(false);
      setChatTextVal("");
      return true;
    });
  };

  const handleFileUpload = (isImage: boolean) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = isImage ? "image/*" : "*";
    fileInput.click();
    fileInput.onchange = async (e) => {
      const files = (e.target as HTMLInputElement)?.files;
      if (!files) return;
      const file = files[0];
      //check the file size > 5mb
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size should be less than 5mb",
          variant: "destructive",
        });
        return;
      }
      //convet file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const data = reader.result as string;
        setFileData(data);
        setFileName(file.name);
        setIsCaptionOpen(true);
      };
    };
  };

  const handleFileUploadToServer = async (
    file: string | null,
    fileName: string | null,
    caption?: string
  ) => {
    if (!file) return;
    const res = await FileHandler.uploadFile(file, fileName || "");

    if (!res.success) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      return;
    }
    await handleSendMessage({
      content: res.data._id,
      _type: (() => {
        if (file?.startsWith("data:image")) return "image";
        if (file?.startsWith("data:video")) return "video";
        if (file?.startsWith("data:audio")) return "audio";
        return "file";
      })(),
      caption,
    });
    setFileData(null);
    setFileName(null);
    setIsCaptionOpen(false);
    setCaption("");
  };

  const sayUserIsTyping = ({
    isTyping,
    isThinking,
  }: {
    isTyping: boolean;
    isThinking: boolean;
  }) => {
    if (socket) {
      socket.emit("user-typing", {
        sentBy: currentUser._id,
        sentTo: chattingWith._id,
        isTyping,
        isThinking,
      });
    }
  };

  const fileInputButtons = [
    {
      icon: IoImageOutline,
      action: () => handleFileUpload(true),
      label: "Upload image",
    },
    {
      icon: TfiClip,
      action: () => handleFileUpload(false),
      label: "Upload file",
    },
    {
      icon: MdMicNone,
      action: () => setIsVoiceMessageInputOpen(true),
      label: "Record audio",
    },
  ];

  return (
    <form
      className="border-t border-muted"
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await handleSendMessage({
          content: chatTextVal,
          _type: "text",
        });
        if (res) {
          setChatTextVal("");
        }
      }}
    >
      <label htmlFor="chat" className="sr-only">
        Your message
      </label>
      <div className="flex items-center gap-2 px-3 py-2 w-full">
        {
          // fileInputButtons
          fileInputButtons.map((button, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              className="p-2"
              onClick={button.action}
            >
              <button.icon className="w-5 h-5" />
              <span className="sr-only">{button.label}</span>
            </Button>
          ))
        }
        <div className="w-full relative">
          <Input
            value={chatTextVal}
            onChange={(e) => setChatTextVal(e.target.value)}
            id="chat"
            ref={chatInputRef}
            placeholder="Your message"
            autoComplete="off"
            onFocus={() =>
              sayUserIsTyping({
                isTyping: true,
                isThinking: false,
              })
            }
            onBlur={() =>
              sayUserIsTyping({
                isTyping: false,
                isThinking: false,
              })
            }
          />
          {replyingTo && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className=" border-l-4 border-primary absolute w-full -top-11 left-0 right-0 bg-gray-100 border h-12 p-2 rounded-t-md flex items-center justify-between"
              >
                <div className="">{replyingTo.data.content}</div>
                <Button
                  onClick={() => {
                    handleReplyAMessage(null);
                  }}
                  variant="ghost"
                  className="p-2"
                >
                  <RxCross2 className="w-4 h-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        <Button type="submit" variant="secondary" className="p-2 px-4 mr-4">
          {isMessageSending ? (
            <Loading type="spin" color="black" height={20} width={20} />
          ) : (
            <IoSend className="w-5 h-5 text-primary" />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </div>
      <Dialog open={isCaptionOpen}>
        <DialogContent>
          <Button
            variant="ghost"
            onClick={() => {
              setFileData(null);
              setIsCaptionOpen(false);
            }}
            className="absolute top-2 right-2"
          >
            <RxCross2 className="w-5 h-5" />
            <span className="sr-only">Remove</span>
          </Button>
          <DialogHeader>
            <DialogTitle>Add a caption!</DialogTitle>
            <DialogDescription className="flex flex-col gap-4 flex-grow">
              {fileData?.startsWith("data:image") ? (
                <img
                  src={fileData}
                  alt="preview"
                  className="w-full rounded-xl object-cover object-center"
                />
              ) : fileData?.startsWith("data:video") ? (
                <video
                  src={fileData}
                  className="w-full h-full rounded-xl"
                  controls
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500 h-24">No preview available</p>
                </div>
              )}
              <div className="flex gap-4 ">
                <Input
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsCaptionOpen(false);
                    handleFileUploadToServer(
                      fileData,
                      fileName,
                      caption || undefined
                    );
                  }}
                  autoFocus
                  className="flex-grow"
                  placeholder="Write something.."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsCaptionOpen(false);
                    handleFileUploadToServer(
                      fileData,
                      fileName,
                      caption || undefined
                    );
                  }}
                >
                  Send
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <VoiceMessageInput
        isOpen={isVoiceMessageInputOpen}
        setIsOpen={setIsVoiceMessageInputOpen}
        handleSendMessage={handleFileUploadToServer}
      />
    </form>
  );
};
export default ChatInput;
