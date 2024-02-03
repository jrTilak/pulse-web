import { Socket } from "socket.io-client";
import { create } from "zustand";
interface SocketState {
  socket: Socket | undefined;
  setSocket: (socket: Socket) => void;
}
const useSocketStore = create<SocketState>((set) => ({
  socket: undefined,
  setSocket: (socket) => set({ socket: socket }),
}));

const useSocket = () => useSocketStore((state) => state);

export default useSocket;
