import { useQueries, useQuery } from "@tanstack/react-query";
import ProfileComp from "./profile-comp";
import UserHandler from "@/handlers/user-handlers";
import { useParams } from "react-router-dom";
import useUserProfileStore from "@/app/providers/user-profile-provider";
import { useEffect } from "react";
import PostHandler from "@/handlers/post-handlers";
import { IPost } from "@/types/post-types";
import useAuthStore from "@/app/providers/auth-providers";

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { setUser, setIsError, setIsLoading } = useUserProfileStore();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["user-profile", username],
    queryFn: () => UserHandler.getUserByUsername(username || ""),
  });

  const queries =
    data?.posts?.map((postId) => {
      return {
        queryKey: ["post", postId],
        queryFn: () => PostHandler.getPostById(postId),
        enabled: data && data.posts && data.posts.length > 0,
      };
    }) || [];

  const results = useQueries({ queries });

  useEffect(() => {
    setIsLoading(isLoading);
    setIsError(isError);
    setUser(data);
    return () => {
      setIsLoading(false);
      setIsError(false);
    };
  }, [isLoading, isError, data]);

  return (
    <ProfileComp
      qPosts={results.sort(
        (a, b) =>
          new Date(b?.data?.createdAt || "").getTime() -
          new Date(a?.data?.createdAt || "").getTime()
      )}
    />
  );
};
export default ProfilePage;
