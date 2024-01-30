import { useQueries, useQuery } from "@tanstack/react-query";
import ProfileComp from "./profile-comp";
import UserHandler from "@/handlers/user-handlers";
import { useParams } from "react-router-dom";
import useUserProfileStore from "@/app/providers/user-profile-provider";
import { useEffect } from "react";
import PostHandler from "@/handlers/post-handlers";
import { IPost } from "@/types/post-types";

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { setUser, setIsError, setIsLoading, setPosts } = useUserProfileStore();
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

  useEffect(() => {
    const posts = results
      ?.map((result) => result.data as IPost)
      .filter((post) => post);

    if (JSON.stringify(posts) !== JSON.stringify(posts)) {
      setPosts(posts);
    }
  }, [results]);

  return <ProfileComp qPosts={results} />;
};
export default ProfilePage;
