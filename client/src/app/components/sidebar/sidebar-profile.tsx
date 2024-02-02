import { FaHeart } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { RiUserFollowFill } from "react-icons/ri";
import UserAvatar from "@/app/components/avatars/user-avatar";
import { IUser } from "@/types/user-types";
import { useQuery } from "@tanstack/react-query";
const SidebarProfile = () => {
  const { data: currentUser } = useQuery<IUser, string>({
    queryKey: ["currentUser"],
  });
  return (
    <>
      <UserAvatar
        user={currentUser as IUser}
        className="rounded-full w-24 !h-24 object-cover"
        width={200}
        height={200}
      />
      <h2 className="w-full overflow-hidden text-2xl font-semibold text-center capitalize cursor-default text-ellipsis">
        {currentUser?.name}
      </h2>
      <h3 className="w-full overflow-hidden text-center cursor-default text-muted-foreground text-ellipsis">
        @{currentUser?.username}
      </h3>

      <div className="flex gap-2 my-4 opacity-80">
        <div className="flex items-center justify-center gap-1 cursor-default">
          <span className="font-semibold">{currentUser?.following || 0}</span>
          <RiUserFollowFill className="w-5 h-5" />
        </div>
        <hr className="w-px h-6 rounded bg-muted-foreground opacity-40" />

        <div className="flex items-center justify-center gap-1 cursor-default">
          <span className="font-semibold">{currentUser?.followers || 0}</span>
          <FaUserFriends className="w-5 h-5" />
        </div>
        <hr className="w-px h-6 rounded bg-muted-foreground opacity-40" />

        <div className="flex items-center justify-center gap-1 cursor-default">
          <span className="font-semibold">{currentUser?.likes || 0}</span>
          <FaHeart className="w-4 h-4" />
        </div>
      </div>
    </>
  );
};

export default SidebarProfile;
