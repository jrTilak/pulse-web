import { AVATAR_PLACEHOLDER } from "@/assets/constants/placeholders";
import UserHandler from "@/handlers/user-handlers";
import { IPostComment } from "@/types/post-types";
import { IUser } from "@/types/user-types";
import DateUtils from "@/utils/date-utils";
import { useQuery } from "@tanstack/react-query";

const Comment = ({ comment }: { comment: IPostComment }) => {
  const { isLoading, data: user } = useQuery<Partial<IUser>>({
    queryKey: ["user", comment?.createdBy],
    queryFn: () =>
      UserHandler.getUserById(comment?.createdBy, ["name", "profileImg"]),
  });
  if (isLoading) return null;
  return (
    <div className="flex items-center w-full space-x-2">
      <div className="flex self-start flex-shrink-0 cursor-pointer">
        <img
          src={user?.profileImg || AVATAR_PLACEHOLDER}
          alt=""
          className="object-cover object-center w-8 h-8 rounded-full"
        />
      </div>

      <div className="flex items-center justify-center w-full space-x-2">
        <div className="block w-full">
          <div className="w-full px-2 pb-2 bg-gray-100 rounded-xl">
            <div className="font-medium">
              <a href="#" className="text-sm hover:underline">
                <small>{user?.name || "Unknown"}</small>
              </a>
            </div>
            <div className="text-xs">{comment.content}</div>
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
                <small>
                  {DateUtils.getTimeElapsed(comment.createdAt.toString())}
                </small>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Comment;
