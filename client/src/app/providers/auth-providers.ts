import { IUser } from "@/types/user-types";
import { create } from "zustand";

interface AuthState {
  currentUser: IUser | null;
  setCurrentUser: (user: IUser | null) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));

export default useAuthStore;
