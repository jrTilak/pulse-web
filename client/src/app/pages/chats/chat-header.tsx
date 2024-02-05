import { CiSearch } from "react-icons/ci";
import { IoCallOutline } from "react-icons/io5";
import { IoVideocamOutline } from "react-icons/io5";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { Link } from "react-router-dom";
// import { useState } from "react";
// import VideoCall from "../call/video-call";
import DateUtils from "@/utils/date-utils";
import { IUser } from "@/types/user-types";
import { useState } from "react";
import VideoCall from "@/app/components/call/video-call";
import UserImageOnly from "@/app/components/avatars/user-image-only";

export const ChatHeader = ({ user }: { user: IUser }) => {
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const headerIcons = [
    {
      icon: CiSearch,
      action: () => {},
      label: "Search",
    },
    {
      icon: IoCallOutline,
      action: () => {},
      label: "Call",
    },
    {
      icon: IoVideocamOutline,
      action: () => setIsVideoCallOpen(true),
      label: "Video Call",
    },
    {
      icon: HiOutlineDotsHorizontal,
      action: () => {},
      label: "More",
    },
  ];
  return (
    <>
      <div className="w-full px-6 py-4 border-b border-muted">
        <div className="flex items-center justify-between w-full">
          <UserAvatar user={user as IUser} />
          <div className="flex gap-2">
            {headerIcons.map((icon, index) => (
              <button
                key={index}
                onClick={icon.action}
                className="flex items-center cursor-pointer justify-center w-10 h-10 p-2 rounded-full hover:bg-muted"
              >
                <icon.icon className="w-6 h-6 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <VideoCall
        isOpen={isVideoCallOpen}
        setIsOpen={setIsVideoCallOpen}
        chattingWith={user}
      />
    </>
  );
};

const UserAvatar = ({ user }: { user: IUser }) => {
  return (
    <Link to={`/u/${user.username}`} className="flex items-center gap-2 w-max">
      <UserImageOnly
        img={user.profileImg}
        name={user.name}
        isOnline={user.isOnline}
      />
      <div className="font-semibold text-gray-800 truncate dark:text-gray-50 flex flex-col">
        <span>{user.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {user.isOnline
            ? "Online"
            : "last seen " + DateUtils.getTimeElapsed(user.lastSeen) + " ago"}
        </span>
      </div>
    </Link>
  );
};
