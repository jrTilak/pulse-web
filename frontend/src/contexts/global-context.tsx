import { useAuthContext } from "@/hooks/use-auth";
import { GlobalContext } from "@/hooks/use-global";
import { ReactNode, useEffect, useState } from "react";
import Peer, { MediaConnection } from "peerjs";
export interface GlobalContextType {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isUserInCall: boolean;
  setIsUserInCall: React.Dispatch<React.SetStateAction<boolean>>;
  peer: Peer;
  isCallIncoming: boolean;
  setIsCallIncoming: React.Dispatch<React.SetStateAction<boolean>>;
  callingWithId: string;
  peerCall: MediaConnection | null;
  remoteUserStream: MediaStream | null;
  setRemoteUserStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
}
// Auth provider component
export const GlobalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserInCall, setIsUserInCall] = useState(false);
  const [isCallIncoming, setIsCallIncoming] = useState(false); // to show the incoming call dialog
  const [callingWithId, setCallingWithId] = useState(""); // to show the incoming call dialog
  const { currentUser } = useAuthContext();
  const [peerCall, setPeerCall] = useState<MediaConnection | null>(null); // to show the incoming call dialog
  const [remoteUserStream, setRemoteUserStream] = useState<MediaStream | null>(
    null
  ); // to show the incoming call dialog
  //peerjs instance
  const peer = new Peer(currentUser._id);

  useEffect(() => {
    peer.on("open", (id) => {
      console.log("peerjs id", id);
    });

    peer.on("call", (call) => {
      console.log("call received");
      setPeerCall(call);
      setIsCallIncoming(true);
      setCallingWithId(call.peer);
    });
  }, []);

  const authContextValue: GlobalContextType = {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isUserInCall,
    setIsUserInCall,
    peer,
    isCallIncoming,
    setIsCallIncoming,
    callingWithId,
    peerCall,
    remoteUserStream,
    setRemoteUserStream,
  };

  return (
    <GlobalContext.Provider value={authContextValue}>
      {children}
    </GlobalContext.Provider>
  );
};
