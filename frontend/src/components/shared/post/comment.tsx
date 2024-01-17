import { AVATAR_PLACEHOLDER } from "@/assets/constants/placeholders";
import UserHandler from "@/handlers/user-handlers";
import DateUtils from "@/utils/date-utils";
import { CommentType } from "@/validators/post.validators";
import { useEffect, useState } from "react";

interface UserDetailsType {
  name: string;
  profileImg?: string;
}

const Comment = ({ comment }: { comment: CommentType }) => {
  const { createdBy, content, createdAt } = comment;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({} as UserDetailsType);

  useEffect(() => {
    const action = async () => {
      const res = await UserHandler.getUserById(createdBy, ["name", "profileImg"]);
      if (res.success) setUser(res.data as UserDetailsType);
      setLoading(false);
    };
    action();
  }, [createdBy]);

  if (loading) return null;

  return (
    <div className="flex items-center w-full space-x-2">
      <div className="flex self-start flex-shrink-0 cursor-pointer">
        <img
          src={user.profileImg || AVATAR_PLACEHOLDER}
          alt=""
          className="object-fill w-8 h-8 rounded-full"
        />
      </div>

      <div className="flex items-center justify-center w-full space-x-2">
        <div className="block w-full">
          <div className="w-full px-2 pb-2 bg-gray-100 rounded-xl">
            <div className="font-medium">
              <a href="#" className="text-sm hover:underline">
                <small>{user.name || "Unknown"}</small>
              </a>
            </div>
            <div className="text-xs">{content}</div>
          </div>
          <div className="flex items-center justify-start w-full text-xs">
            <div className="flex items-center justify-center px-2 space-x-1 font-semibold text-gray-700">
              <a href="#" className="hover:underline">
                <small>Like</small>
              </a>
              <small className="self-center">.</small>
              <a href="#" className="hover:underline">
                <small>Reply</small>
              </a>
              <small className="self-center">.</small>
              <a href="#" className="hover:underline">
                <small>{DateUtils.getTimeElapsed(createdAt.toString())}</small>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Comment;
