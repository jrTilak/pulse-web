import { AVATAR_PLACEHOLDER } from "@/assets/constants/placeholders";
import { UserType } from "@/types/user.types";

const NoChatsFound = ({ user }: { user: UserType }) => {
  return (
    <div className="flex flex-col justify-between w-full h-full m-auto mt-24">
      <div className="flex flex-col items-center justify-center gap-1">
        <img
          src={user.profileImg || AVATAR_PLACEHOLDER}
          alt=""
          className="object-cover object-center w-16 h-16 rounded-full"
        />
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-center">{user.name}</span>
          <span className="text-sm text-center">(@{user.username})</span>
        </div>
        <span className="text-sm text-center">
          No chats yet, send a message to start chatting
        </span>
      </div>
    </div>
  );
};
export default NoChatsFound;
