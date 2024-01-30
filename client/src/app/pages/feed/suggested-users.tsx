import { Skeleton } from "@/app/components/ui/skeleton";
import { AVATAR_PLACEHOLDER } from "@/assets/constants/placeholders";
import UserHandler from "@/handlers/user-handlers";
import { IUser } from "@/types/user-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: UserHandler.getSuggestedUsers,
  });

  return (
    <>
      <span className="font-bold text-base">Suggested Users</span>
      <div className="flex flex-col gap-4">
        {isLoading && (
          <>
            <LoadingUser />
            <LoadingUser />
            <LoadingUser />
            <LoadingUser />
          </>
        )}
        {suggestedUsers?.map((user) => (
          <User user={user} key={user._id} />
        ))}
        {!isLoading && suggestedUsers?.length === 0 && (
          <span className="text-sm text-muted-foreground">
            No suggested users
          </span>
        )}
      </div>
    </>
  );
};
export default SuggestedUsers;

const User = ({ user }: { user: IUser }) => {
  const queryClient = useQueryClient();
  const followUser = useMutation({
    mutationFn: () => UserHandler.followUser(user.username, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
      toast.success(`You are now following ${user.name}`);
    },
    onError: () => {
      toast.error("Failed to follow user");
    },
  });
  return (
    <div key={user._id} className="flex items-center gap-4">
      <Link to={`/u/${user.username}`} className="relative">
        <img
          src={user.profileImg || AVATAR_PLACEHOLDER}
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
        {user.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 bg-opacity-90 rounded-full" />
        )}
      </Link>
      <div className="flex flex-col">
        <h1 className="font-semibold text-sm ">{user.name}</h1>
        <h1 className="text-xs font-extralight text-muted-foreground">
          {user.username}
        </h1>
      </div>
      <button
        onClick={() => followUser.mutate()}
        className="text-sm text-blue-500 ml-auto"
      >
        Follow
      </button>
    </div>
  );
};

const LoadingUser = () => {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex flex-col">
        <Skeleton className="w-20 h-4 rounded-sm" />
        <Skeleton className="w-10 h-3 rounded-sm mt-1" />
      </div>
    </div>
  );
};
