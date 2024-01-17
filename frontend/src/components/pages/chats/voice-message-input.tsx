import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { IoMicOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import Loading from "react-loading";

const VoiceMessageInput = ({
  isOpen,
  setIsOpen,
  handleSendMessage,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSendMessage: (
    file: string | null,
    fileName: string | null,
    caption?: string
  ) => Promise<void>;
}) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>(""); // Add type annotation for audioUrl
  const mediaRecorder = useRef<MediaRecorder | null>(null); // Add type annotation for mediaRecorder

  const startRecording = () => {
    try {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.start();

        const audioChunks: BlobPart[] = []; // Add type annotation for audioChunks
        mediaRecorder.current.addEventListener(
          "dataavailable",
          (event: any) => {
            // Add type annotation for event
            audioChunks.push(event.data);
          }
        );

        mediaRecorder.current.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          const reader = new FileReader();

          reader.onloadend = () => {
            const base64String = reader.result;
            setAudioUrl(base64String as string);
          };

          reader.readAsDataURL(audioBlob);
        });

        setRecording(true);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="flex flex-col items-center justify-center gap-4 p-6 ">
        <DialogHeader>
          <DialogTitle>
            {recording ? "Recording..." : "Record a voice message"}
          </DialogTitle>
        </DialogHeader>
        <X
          className="absolute top-4 right-4 cursor-pointer"
          onClick={() => {
            setIsOpen(false);
            stopRecording();
            setAudioUrl("");
          }}
        />
        <div
          onClick={recording ? stopRecording : startRecording}
          className="flex items-center justify-center w-32 h-32 p-4 rounded-full bg-muted-2 relative cursor-pointer group"
        >
          {recording ? (
            <Loading type="bubbles" color="purple" />
          ) : (
            <IoMicOutline className="w-16 h-16 text-muted-foreground z-20" />
          )}
          {/* circle basckground */}
          <div className="absolute w-full h-full rounded-full bg-muted-foreground/20"></div>
        </div>
        {audioUrl && !recording && (
          <>
            <audio src={audioUrl} controls />
            <div className="flex gap-4 items-center justify-center">
              <Button
                onClick={() => {
                  setAudioUrl("");
                }}
                variant="secondary"
              >
                Reset
              </Button>
              <Button
                onClick={() => {
                  // convert to base 64
                  const base64Audio = audioUrl.split(",")[1];
                  console.log(base64Audio);
                  handleSendMessage(audioUrl, "voice message");
                  setAudioUrl("");
                  setIsOpen(false);
                }}
                variant="default"
              >
                Send
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VoiceMessageInput;
