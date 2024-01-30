import { IPost } from "@/types/post-types";
import { IUser } from "@/types/user-types";
import { create } from "zustand";

interface UserProfileState {
  user: IUser | undefined;
  setUser: (user: IUser | undefined) => void;
  isError: boolean;
  setIsError: (isError: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  posts: IPost[];
  setPosts: (posts: IPost[]) => void;
}

const useUserProfileState = create<UserProfileState>((set) => ({
  user: undefined,
  setUser: (user) => set({ user: user }),
  isError: false,
  setIsError: (isError) => set({ isError: isError }),
  isLoading: true, // default to true as we are fetching data
  setIsLoading: (isLoading) => set({ isLoading: isLoading }),
  posts: [],
  setPosts: (posts) => set({ posts: posts }),
}));

const useUserProfileStore = () => useUserProfileState((state) => state);

export default useUserProfileStore;
