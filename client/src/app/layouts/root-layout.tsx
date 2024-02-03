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

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { setSocket } = useSocket();
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

  return (
    <div className="min-h-screen flex md:flex-row flex-col-reverse">
      <SidebarHeader />
      <SidebarComp />
      <ScrollArea className={cn("md:h-screen w-full", height.max)}>
        <div className={cn("mx-auto", height.max)}>{children}</div>
      </ScrollArea>
    </div>
  );
};
export default RootLayout;
