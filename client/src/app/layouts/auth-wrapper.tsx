import LoadingPage from "@/app/pages/shared/loading-page";
import { UserAuthHandler } from "@/handlers/auth-handlers";
import { IUser } from "@/types/user-types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostHandler from "@/handlers/post-handlers";

const NO_AUTH_ROUTES = ["/login", "/signup", "/"];

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation();
  const {
    data: currentUser,
    isError,
    isLoading,
  } = useQuery<IUser, string>({
    queryKey: ["currentUser"],
    queryFn: UserAuthHandler.verifyUser,
  });

  //get saved posts
  useQuery({
    queryKey: ["savedPosts"],
    enabled: currentUser?.username !== undefined,
    queryFn: () => PostHandler.getSavedPosts(currentUser?.username || ""),
  });

  useEffect(() => {
    if (isLoading) return;
    if (isError || !currentUser) {
      if (!NO_AUTH_ROUTES.includes(currentPath)) {
        navigate(`/login?redirect=${currentPath}`, { replace: true });
      }
      return;
    }
    if (NO_AUTH_ROUTES.includes(currentPath)) {
      navigate("/feed", { replace: true });
    } else {
      navigate(currentPath, { replace: true });
    }
  }, [currentUser, isError, isLoading, navigate, currentPath]);

  if (isLoading) return <LoadingPage />;
  return <>{children}</>;
};
export default AuthWrapper;
