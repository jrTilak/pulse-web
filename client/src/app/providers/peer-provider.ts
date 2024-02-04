import { create } from "zustand";
import Peer, { MediaConnection } from "peerjs";
interface PeerState {
  peer: Peer | undefined;
  setPeer: (socket: Peer) => void;
  isUserInCall: boolean;
  setIsUserInCall: (isUserInCall: boolean) => void;
  isCallIncoming: boolean;
  setIsCallIncoming: (isCallIncoming: boolean) => void;
  callingWithId: string;
  peerCall: MediaConnection | null;
  remoteUserStream: MediaStream | null;
  setRemoteUserStream: (remoteUserStream: MediaStream | null) => void;
  setCallingWithId: (callingWithId: string) => void;
  setPeerCall: (peerCall: MediaConnection | null) => void;
}
const usePeerStore = create<PeerState>((set) => ({
  peer: undefined,
  setPeer: (peer) => set({ peer: peer }),
  isUserInCall: false,
  setIsUserInCall: (isUserInCall) => set({ isUserInCall: isUserInCall }),
  isCallIncoming: false,
  setIsCallIncoming: (isCallIncoming) =>
    set({ isCallIncoming: isCallIncoming }),
  peerCall: null,
  remoteUserStream: null,
  setRemoteUserStream: (remoteUserStream) =>
    set({ remoteUserStream: remoteUserStream }),
  callingWithId: "",
  setCallingWithId: (callingWithId) => set({ callingWithId: callingWithId }),
  setPeerCall: (peerCall) => set({ peerCall: peerCall }),
}));

const usePeer = () => usePeerStore((state) => state);

export default usePeer;
