import UserAvatar from "../avatars/user-avatar-with-story";
import UserHandler from "@/handlers/user-handlers";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/types/user-types";
import { Skeleton } from "../ui/skeleton";

const GetUser = ({ _id }: { _id: string }) => {
  const { data: user, isLoading: loading } = useQuery<Partial<IUser>>({
    queryKey: ["user", _id],
    queryFn: () => UserHandler.getUserById(_id),
  });

  if (user?.stories?.length === 0) return null;
  return (
    <div className="flex flex-col gap-1 w-20 justify-center items-center">
      {loading ? (
        <Skeleton className="h-12 w-12 rounded-full" />
      ) : (
        <UserAvatar user={user as IUser} className="h-12 w-12" />
      )}
      {loading ? (
        <Skeleton className="w-full overflow-hidden text-ellipsis text-xs text-center" />
      ) : (
        <span className="w-full overflow-hidden text-ellipsis text-xs text-center">
          @{user?.username || "unknown"}
        </span>
      )}
    </div>
  );
};

export default GetUser;
