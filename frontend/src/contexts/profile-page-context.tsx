import PostHandler from "@/handlers/post-handlers";
import UserHandler from "@/handlers/user-handlers";
import { useAuthContext } from "@/hooks/use-auth";
import { ProfilePageContext } from "@/hooks/use-profile-page";
import { PostType } from "@/types/post.types";
import { UserType } from "@/types/user.types";
import { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export interface ProfilePageContextType {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
  isLoading: boolean;
  isOwner: boolean;
  posts: PostType[];
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
}
// Auth provider component
export const ProfilePageContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState({} as UserType);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const { currentUser } = useAuthContext();
  const [posts, setPosts] = useState([] as PostType[]);
  useEffect(() => {
    const action = async () => {
      const res = await UserHandler.getUserByUsername(username || "");
      setIsLoading(false);
      if (!res.success) return setErr("404");
      setUser(res.data);
      if (res.data.username === currentUser.username) setIsOwner(true);
      const data = await PostHandler.getUsersAllPosts(res.data.username);
      if (data.success) setPosts(data.data);
    };
    action();
  }, [username]);

  useEffect(() => {
    if (currentUser.username === username) {
      setIsOwner(true);
      setUser(currentUser);
    }
  }, [currentUser]);

  const profilePageContextValue: ProfilePageContextType = {
    user,
    setUser,
    isLoading,
    isOwner,
    posts,
    setPosts,
  };

  if (err == "404") return <h1>404</h1>;
  if (isLoading) return <h1>Loading...</h1>;

  return (
    <ProfilePageContext.Provider value={profilePageContextValue}>
      {children}
    </ProfilePageContext.Provider>
  );
};
