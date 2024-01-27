import LoadingPage from "@/components/pages/shared/loading-page";
import { AuthContext } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { UserType } from "@/types/user.types";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { UserAuthHandler } from "@/handlers/auth-handlers";
import UserHandler from "@/handlers/user-handlers";
import PostHandler from "@/handlers/post-handlers";

export interface AuthContextType {
  currentUser: UserType;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserType>>;
  handleLogoutUser: () => Promise<void>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  currentUserFollowingList: string[];
  setCurrentUserFollowingList: React.Dispatch<React.SetStateAction<string[]>>;
  savedPostsId: string[];
  setSavedPostsId: React.Dispatch<React.SetStateAction<string[]>>;
  socket: Socket | null;
  isLoaded: boolean;
}
// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState({} as UserType);
  const [savedPostsId, setSavedPostsId] = useState([] as string[]);
  const [currentUserFollowingList, setCurrentUserFollowingList] = useState(
    [] as string[]
  );
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [socket, setSocket] = useState(null as Socket | null);

  const noAuthRoutes = ["/login", "/signup", "/"];
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const action = async () => {
      const res = await UserAuthHandler.verifyUser();
      setIsFetchingUser(false);
      if (res.success) {
        setCurrentUser(res.data);
        setIsAuthenticated(true);
        const response = await UserHandler.getCurrentUserFollowing();
        if (response.success) {
          setCurrentUserFollowingList(response.data);
        }
        const savedPosts = await PostHandler.getSavedPosts(res.data.username);
        if (savedPosts.success) {
          setSavedPostsId(savedPosts.data);
        }
        const socket = io(`${import.meta.env.VITE_WS_URL}`, {
          query: {
            userId: res.data._id,
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
      }
    };

    action();
  }, []);

  setTimeout(() => {
    setIsLoaded(true);
  }, 300);

  const handleLogoutUser = async () => {
    const res = await UserAuthHandler.logoutUser();
    if (res.success) {
      setIsAuthenticated(false);
      setCurrentUser({} as UserType);
      navigate("/login");
    } else {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (noAuthRoutes.includes(location.pathname))
        navigate("/feed", { replace: true });
    }
    if (!isAuthenticated && !noAuthRoutes.includes(location.pathname)) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated]);

  if (!isLoaded || isFetchingUser) return <LoadingPage />;

  const authContextValue: AuthContextType = {
    currentUser,
    setCurrentUser,
    handleLogoutUser,
    setIsAuthenticated,
    currentUserFollowingList,
    setCurrentUserFollowingList,
    savedPostsId,
    setSavedPostsId,
    socket,
    isLoaded,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
