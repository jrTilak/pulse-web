import { FaHeart } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { RiUserFollowFill } from "react-icons/ri";
import { IUser } from "@/types/user-types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import UserAvatarWithStory from "../avatars/user-avatar-with-story";
const SidebarProfile = () => {
  const { data: currentUser } = useQuery<IUser, string>({
    queryKey: ["currentUser"],
  });
  return (
    <>
      <UserAvatarWithStory user={currentUser as IUser} className="w-28 h-28" />
      <Link
        to={`/u/${currentUser?.username}`}
        className="w-full overflow-hidden text-2xl font-semibold text-center capitalize text-ellipsis hover:underline transition-all cursor-pointer"
      >
        {currentUser?.name}
      </Link>
      <Link
        to={`/u/${currentUser?.username}`}
        className="w-full overflow-hidden text-center text-muted-foreground text-ellipsis hover:underline transition-all cursor-pointer"
      >
        @{currentUser?.username}
      </Link>

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
