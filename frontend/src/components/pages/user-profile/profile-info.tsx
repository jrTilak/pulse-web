import { RiUserFollowFill } from "react-icons/ri";
import { Button } from "../../ui/button";
import { FaUserFriends } from "react-icons/fa";
import { useProfilePageContext } from "@/hooks/use-profile-page";

const ProfileInfo = () => {
  const { user } = useProfilePageContext();
  return (
    <div className="justify-center w-full mt-3 ml-3 space-y-1">
      {/* <!-- User basic--> */}
      <div className="flex justify-between ">
        <div>
          <h2 className="inline text-xl font-bold leading-6 text-foreground">
            {user.name + " "}
            <p className="inline text-sm font-medium leading-5 text-muted-foreground">
              {" "}
              (@{user.username})
            </p>
          </h2>
        </div>
        <div className="flex items-center gap-0 mr-4 md:hidden">
          <Button
            variant="ghost"
            className="flex items-center justify-center gap-1 cursor-pointer hover:bg-none"
          >
            <span className="font-semibold">
              {user.following || 0}
            </span>
            <RiUserFollowFill className="w-5 h-5" />
          </Button>
          <hr className="w-px h-6 rounded md:mx-2 bg-muted-foreground opacity-40" />
          <Button
            variant="ghost"
            className="flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="font-semibold">
              {user.followers || 0}
            </span>
            <FaUserFriends className="w-5 h-5" />
          </Button>
        </div>
      </div>
      {/* <!-- Description and others --> */}
    </div>
  );
};
export default ProfileInfo;
