import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog";
import { IoVideocamOutline } from "react-icons/io5";
import { MdCallEnd } from "react-icons/md";
import UserHandler from "@/handlers/user-handlers";
import usePeer from "@/app/providers/peer-provider";
import { IUser } from "@/types/user-types";

const IncomingCall = () => {
  const {
    isCallIncoming,
    setIsCallIncoming,
    callingWithId,
    peerCall,
    setIsUserInCall,
    setRemoteUserStream,
  } = usePeer();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [callingUser, setCallingUser] = useState<IUser | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (isCallIncoming && videoRef.current) {
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

    (async () => {
      const user = await UserHandler.getUserById(callingWithId, ["name"]);
      if (user) setCallingUser(user as IUser);
    })();
  }, [isCallIncoming, callingWithId]);

  const handleRejectCall = () => {
    setIsCallIncoming(false);
    //inform the other user that call is rejected

    //release camera
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });

      videoRef.current.srcObject = null;
    }
    peerCall?.close();
  };

  const handleAcceptCall = () => {
    setIsCallIncoming(false);
    setIsUserInCall(true);
    peerCall?.answer(videoRef.current!.srcObject as MediaStream);
    peerCall?.on("stream", (remoteStream) => {
      setRemoteUserStream(remoteStream);
    });
  };

  return (
    <Dialog open={isCallIncoming}>
      <DialogContent className="flex flex-col gap-4 items-center justify-center w-max bg-muted h-max">
        <DialogTitle className="text-muted-foreground text-center">
          Incoming call from{" "}
          <span className="text-gray-600 ">{callingUser?.name}</span>!
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
            onClick={handleRejectCall}
          >
            <MdCallEnd className="w-6 h-6" />
          </button>
          <button
            onClick={handleAcceptCall}
            className="w-10 h-10 p-2 rounded-full text-muted bg-primary"
          >
            <IoVideocamOutline className="w-6 h-6" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncomingCall;