import { UserType } from "@/types/user.types";
import { useEffect, useState } from "react";
import UserAvatar from "../avatars/user-avatar";
import UserHandler from "@/handlers/user-handlers";

const GetUser = ({ _id }: { _id: string }) => {
  const [user, setUser] = useState({} as UserType);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const action = async () => {
      const res = await UserHandler.getUserById(_id);
      setLoading(false);
      if (res.success) setUser(res.data as UserType);
      console.log(res);
    };
    action();
  }, []);
  if (loading || user?.stories?.length === 0) return null;
  return (
    <div className="flex flex-col gap-1 w-20 justify-center items-center">
      {<UserAvatar user={user} className="h-12 w-12" />}
      <span className="w-full overflow-hidden text-ellipsis text-xs text-center">
        @{user.username}
      </span>
    </div>
  );
};

export default GetUser;
