import LoadingPage from "@/app/pages/shared/loading-page";
import { UserAuthHandler } from "@/handlers/auth-handlers";
import useAuthStore from "@/app/providers/auth-providers";
import { IUser } from "@/types/user-types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NO_AUTH_ROUTES = ["/login", "/signup", "/"];

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation();
  const { setCurrentUser } = useAuthStore((state) => state);
  const { data, isError, isLoading } = useQuery<IUser, string>({
    queryKey: ["verifyUser"],
    queryFn: UserAuthHandler.verifyUser,
  });

  useEffect(() => {
    if (isLoading) return;
    if (isError || !data) {
      if (!NO_AUTH_ROUTES.includes(currentPath)) {
        navigate(`/login?redirect=${currentPath}`, { replace: true });
      }
      return;
    }
    setCurrentUser(data);
    if (NO_AUTH_ROUTES.includes(currentPath)) {
      navigate("/feed", { replace: true });
    } else {
      navigate(currentPath, { replace: true });
    }
  }, [data]);

  if (isLoading) return <LoadingPage />;
  return <>{children}</>;
};
export default AuthWrapper;
