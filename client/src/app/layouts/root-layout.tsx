import { cn } from "@/lib/utils";
import SidebarComp from "@/app/components/sidebar/sidebar-comp";
import SidebarHeader from "@/app/components/sidebar/sidebar-header";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { height } from "@/assets/constants/styles";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/types/user-types";
import useSocket from "../providers/socket-provider";
import Peer from "peerjs";
import usePeer from "../providers/peer-provider";
import { useLocation } from "react-router-dom";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { setSocket } = useSocket();
  const {
    setPeerCall,
    setIsCallIncoming,
    setCallingWithId,
    setRemoteUserStream,
  } = usePeer();
  const { data: currentUser } = useQuery<IUser>({
    queryKey: ["currentUser"],
  });
  useEffect(() => {
    if (!currentUser?._id) return;
    const socket = io(`${import.meta.env.VITE_WS_URL}`, {
      query: {
        userId: currentUser?._id,
      },
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      setSocket(socket);
    });
    socket.on("error", (err: Error) => {
      console.error("Socket error:", err);
    });
    return () => {
      socket.disconnect();
    };
  }, [currentUser?._id, setSocket]);

  useEffect(() => {
    const peer = new Peer(`pulse_${currentUser?._id}` as string);
    peer.on("open", (id) => {
      console.log("peerjs id", id);
    });

    peer.on("call", (call) => {
      console.log("call received", call);
    });
  }, [
    currentUser?._id,
    currentUser?.username,
    setCallingWithId,
    setIsCallIncoming,
    setPeerCall,
    setRemoteUserStream,
  ]);
  const { pathname } = useLocation();
  return (
    <div className="min-h-[100svh] flex md:flex-row flex-col-reverse">
      <SidebarHeader />
      <SidebarComp />
      <ScrollArea
        className={cn(
          "md:h-screen w-full",
          height.max,
          pathname.startsWith("/chat") ? "h-[100svh]" : ""
        )}
      >
        <div className={cn("mx-auto", height.max)}>{children}</div>
      </ScrollArea>
    </div>
  );
};
export default RootLayout;
