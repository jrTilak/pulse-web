import { useQuery } from "@tanstack/react-query";
import ProfileComp from "./profile-comp";
import UserHandler from "@/handlers/user-handlers";
import { useParams } from "react-router-dom";
import useUserProfileStore from "@/app/providers/user-profile-provider";
import { useEffect } from "react";

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { setUser, setIsError, setIsLoading } = useUserProfileStore();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["user-profile", username],
    queryFn: () => UserHandler.getUserByUsername(username || ""),
  });

  useEffect(() => {
    setIsLoading(isLoading);
    setIsError(isError);
    setUser(data);
  }, [isLoading, isError, data]);

  return <ProfileComp />;
};
export default ProfilePage;
