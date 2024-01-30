import { useEffect, useState } from "react";
import UserAvatar from "../avatars/user-avatar";
import UserHandler from "@/handlers/user-handlers";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/types/user-types";

const GetUser = ({ _id }: { _id: string }) => {
  const { data: user, isLoading: loading } = useQuery({
    queryKey: ["user", _id],
    queryFn: () => UserHandler.getUserById(_id),
  });

  if (loading || user?.stories?.length === 0) return null;
  return (
    <div className="flex flex-col gap-1 w-20 justify-center items-center">
      {<UserAvatar user={user as IUser} className="h-12 w-12" />}
      <span className="w-full overflow-hidden text-ellipsis text-xs text-center">
        @{user?.username}
      </span>
    </div>
  );
};

export default GetUser;
