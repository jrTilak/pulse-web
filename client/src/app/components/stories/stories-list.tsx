import { AVATAR_PLACEHOLDER } from "@/assets/constants/placeholders";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import GetUser from "./get-user";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/types/user-types";
import UserHandler from "@/handlers/user-handlers";

const StoriesList = () => {
  const { data: currentUser } = useQuery<IUser>({
    queryKey: ["currentUser"],
  });
  const { data: currentUserFollowingList } = useQuery<string[]>({
    queryKey: ["currentUserFollowingList"],
    queryFn: UserHandler.getCurrentUserFollowers,
  });
  return (
    <>
      <Link
        to="/new/story"
        className="flex flex-col gap-1 w-14 justify-center items-center"
      >
        <div className="relative">
          <img
            className="h-12 w-12 rounded-full object-cover object-center mb-2 ring-2 ring-background"
            src={currentUser?.profileImg || AVATAR_PLACEHOLDER}
            alt="add"
          />

          <button className="p-0.5 rounded-full bg-muted absolute bottom-1 right-1">
            <FiPlus className="w-3 h-3 text-primary" />
          </button>
        </div>
        <span className="w-full overflow-hidden text-ellipsis text-xs text-center">
          Add Story
        </span>
      </Link>
      <GetUser _id={currentUser?._id || ""} />
      {currentUserFollowingList?.map((_id) => (
        <GetUser _id={_id} key={_id} />
      ))}
    </>
  );
};
export default StoriesList;
