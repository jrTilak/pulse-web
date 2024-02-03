import { TfiClip } from "react-icons/tfi";
import { IoImageOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import React, { useState } from "react";
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
} from "@/app/components/ui/dialog";
import FileHandler from "@/handlers/file-handlers";
import VoiceMessageInput from "./voice-message-input";
import { IUser } from "@/types/user-types";
import { IChat } from "@/types/chat-types";
import toast from "react-hot-toast";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

const ChatInput = ({ chattingWith }: { chattingWith: IUser }) => {
  const [chatTextVal, setChatTextVal] = useState("");
  const [isMessageSending, setIsMessageSending] = useState(false);
  const [isCaptionOpen, setIsCaptionOpen] = useState(false);
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null); // for file upload [optional
  const [caption, setCaption] = useState("");
  const [isVoiceMessageInputOpen, setIsVoiceMessageInputOpen] = useState(false);

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
        toast.error("File size should be less than 5mb");
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
            placeholder="Your message"
            autoComplete="off"
          />
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
                  //   onSubmit={(e) => {
                  //     e.preventDefault();
                  //     setIsCaptionOpen(false);
                  //     handleFileUploadToServer(
                  //       fileData,
                  //       fileName,
                  //       caption || undefined
                  //     );
                  //   }}
                  autoFocus
                  className="flex-grow"
                  placeholder="Write something.."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <Button
                  variant="secondary"
                  //   onClick={() => {
                  //     setIsCaptionOpen(false);
                  //     handleFileUploadToServer(
                  //       fileData,
                  //       fileName,
                  //       caption || undefined
                  //     );
                  //   }}
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
        // handleSendMessage={handleFileUploadToServer}
      />
    </form>
  );
};
export default ChatInput;
