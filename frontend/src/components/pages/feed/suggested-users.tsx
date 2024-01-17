import { AVATAR_PLACEHOLDER } from "@/assets/constants/placeholders";
import UserHandler from "@/handlers/user-handlers";
import { useAuthContext } from "@/hooks/use-auth";
import { UserType } from "@/types/user.types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
  const { currentUser } = useAuthContext();
  const [suggestedUsers, setSuggestedUsers] = useState([] as UserType[]);

  useEffect(() => {
    const action = async () => {
      const response = await UserHandler.getSuggestedUsers();
      if (response.success) setSuggestedUsers(response.data as UserType[]);
    };
    action();
  }, [currentUser]);

  return (
    <>
      <span className="font-bold text-base">Suggested Users</span>
      <div className="flex flex-col gap-4">
        {suggestedUsers.map((user) => (
          <Link
            to={`/u/${user.username}`}
            key={user._id}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <img
                src={user.profileImg || AVATAR_PLACEHOLDER}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
              {user.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 bg-opacity-90 rounded-full" />
              )}
            </div>
            <div className="flex flex-col">
              <h1 className="font-semibold text-sm ">{user.name}</h1>
              <h1 className="text-xs font-extralight text-muted-foreground">
                {user.username}
              </h1>
            </div>
            <button className="text-sm text-blue-500">Follow</button>
          </Link>
        ))}
        {suggestedUsers.length === 0 && (
          <span className="text-sm text-muted-foreground">
            No suggested users
          </span>
        )}
      </div>
    </>
  );
};
export default SuggestedUsers;
