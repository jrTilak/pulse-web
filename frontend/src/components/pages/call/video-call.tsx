import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UserType } from "@/types/user.types";
import { IoVideocamOutline } from "react-icons/io5";
import callingAudio from "@/assets/audio/calling-audio.mp3";
import { MdCallEnd } from "react-icons/md";
import { useGlobalContext } from "@/hooks/use-global";
const VideoCall = ({
  isOpen,
  setIsOpen,
  chattingWith,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  chattingWith: UserType;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCalling, setIsCalling] = useState(false);
  const { peer, setRemoteUserStream, setIsUserInCall } = useGlobalContext();
  useEffect(() => {
    setTimeout(() => {
      if (isOpen && videoRef.current) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            videoRef.current!.srcObject = stream;
          })
          .catch((error) => {
            console.error("Error accessing camera:", error);
          });
      }
    }, 100); // delay to show dialog because videoRef is not available immediately
  }, [isOpen]);

  const handleMakeACall = () => {
    setIsCalling(true);
    const call = peer.call(
      chattingWith._id,
      videoRef.current!.srcObject as MediaStream
    );
    call.on("stream", (remoteStream) => {
      setIsCalling(false);
      setIsUserInCall(true);
      setRemoteUserStream(remoteStream);
    });
  };

  const handleCancelCall = () => {
    setIsOpen(false);
    //release camera
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });

      videoRef.current.srcObject = null;
    }
    setIsCalling(false);

    //inform the other user that call is cancelled
  };

  // play the audio in loop if isCalling is true
  useEffect(() => {
    if (isCalling) {
      const audio = new Audio(callingAudio);
      audio.loop = true;
      audio.play();
      return () => {
        audio.pause();
      };
    }
  }, [isCalling]);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="flex flex-col gap-4 items-center justify-center w-max bg-muted h-max">
        <DialogTitle className="text-muted-foreground text-center">
          {isCalling ? "Calling " : "Want to call "}
          <span className="text-gray-600 ">{chattingWith.name}</span>{" "}
          {isCalling ? "!" : "?"}
        </DialogTitle>

        {/* Video from camera */}

        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-64 h-48 bg-gray-200 rounded-lg border border-gray-300"
        />

        <div className="flex gap-4">
          <button
            className="w-10 h-10 p-2 rounded-full text-muted bg-destructive"
            onClick={handleCancelCall}
          >
            <MdCallEnd className="w-6 h-6" />
          </button>
          {!isCalling && (
            <button
              onClick={handleMakeACall}
              className="w-10 h-10 p-2 rounded-full text-muted bg-primary"
            >
              <IoVideocamOutline className="w-6 h-6" />
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCall;
