import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGlobalContext } from "@/hooks/use-global";
import { useEffect, useRef, useState } from "react";
import {
  MdOutlineVideocam,
  MdOutlineVideocamOff,
  MdCallEnd,
} from "react-icons/md";

const CallAccepted = () => {
  const { isUserInCall, setIsUserInCall, remoteUserStream } =
    useGlobalContext();
  // const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const remoteUserMediaRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (isUserInCall && videoRef.current) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            videoRef.current!.srcObject = stream;
          })
          .catch((error) => {
            console.error("Error accessing camera:", error);
          });

        if (remoteUserMediaRef.current) {
          remoteUserMediaRef.current.srcObject = remoteUserStream;
        }
      }
    }, 100); // delay to show dialog because videoRef is not available immediately
  }, [isUserInCall, remoteUserStream]);

  return (
    <Dialog open={isUserInCall}>
      <DialogContent className="flex flex-col gap-4 items-center justify-center bg-muted aspect[5/4] h-[80%] group">
        <DialogTitle className=" text-center z-20 top-2 absolute inset-x-1/2 -translate-x-1/2 text-primary text-xl">
          00:00:00
        </DialogTitle>
        {/* Video from camera */}
        {/* //other user video */}
        <video
          ref={remoteUserMediaRef}
          autoPlay
          muted
          className="w-full h-full bg-gray-200 absolute rounded-lg border border-gray-300 object-cover object-center"
        />
        {/* //your video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          className="aspect[4/5] h-24 bg-gray-200 absolute rounded-lg border border-gray-300 object-cover object-center top-2 left-2"
        />
        <div className="gap-4 z-20 absolute bottom-2 flex left-1/2 -translate-x-1/2">
          <button
            className="w-10 h-10 p-2 rounded-full text-muted bg-destructive"
            onClick={() => {
              setIsUserInCall(false);
              //release camera
              if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                const tracks = stream.getTracks();

                tracks.forEach((track) => {
                  track.stop();
                });
                videoRef.current.srcObject = null;
              }
            }}
          >
            <MdCallEnd className="w-full h-full" />
          </button>
          <button
            className="w-10 h-10 p-2 rounded-full text-muted bg-primary"
            onClick={() => {
              if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                const tracks = stream.getTracks();

                tracks.forEach((track) => {
                  if (track.kind === "video") {
                    track.enabled = !track.enabled;
                    setIsVideoOn(track.enabled);
                  }
                });
              }
            }}
          >
            {isVideoOn ? (
              <MdOutlineVideocam className="w-full h-full" />
            ) : (
              <MdOutlineVideocamOff className="w-full h-full" />
            )}
          </button>
          {/* <button
            className="w-10 h-10 p-2 rounded-full text-muted bg-primary"
            onClick={() => {
              if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                const tracks = stream.getTracks();

                tracks.forEach((track) => {
                  if (track.kind === "audio") {
                    // Modify the condition to check for "video"
                    track.enabled = !track.enabled;
                    setIsMicOn(track.enabled);
                  }
                });
              }
            }}
          >
            {isMicOn ? (
              <MdOutlineMicNone className="w-full h-full" />
            ) : (
              <MdOutlineMicOff className="w-full h-full" />
            )}
          </button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CallAccepted;
