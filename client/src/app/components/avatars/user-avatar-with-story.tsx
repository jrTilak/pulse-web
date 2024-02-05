import { cn } from "@/lib/utils";
import { IUser } from "@/types/user-types";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { useState } from "react";
import StoryCard from "../cards/story-card";
import UserImageOnly from "./user-image-only";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import StoryCard from "@/app/components/cards/story-card";

const UserAvatarWithStory = ({
  user,
  className,
}: {
  user: IUser | undefined;
  className?: string;
}) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [visibleStoryIndex, setVisibleStoryIndex] = useState(0);
  const [prevVisibleStoryIndex, setPrevVisibleStoryIndex] = useState(0);
  const onClick = () => {
    if (user?.stories?.length === 0) {
      return navigate(`/u/${user.username}`);
    }
    setIsDialogOpen(true);
  };
  const len = user?.name.split(" ").length || 0;
  const name = user?.name || "Unknown";
  const initials =
    len > 1
      ? name.split(" ")[0][0] + name.split(" ")[1][0]
      : name[0] + name[1] || "U";

  if (!user) return null;

  if (user?.stories?.length === 0) {
    return (
      <UserImageOnly
        img={user.profileImg}
        name={user.name}
        className={className}
        userId={user._id}
      />
    );
  }

  return (
    <>
      <div
        onClick={onClick}
        className={cn(
          "relative cursor-pointer border-2 border-primary rounded-full"
        )}
      >
        <Avatar className={className}>
          <AvatarImage src={user.profileImg} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
      {user?.stories?.length > 0 && (
        <Dialog
          open={isDialogOpen}
          onOpenChange={(isOpen) => {
            setIsDialogOpen(isOpen);
            if (!isOpen) {
              setVisibleStoryIndex(0);
              setPrevVisibleStoryIndex(0);
            }
          }}
        >
          <DialogContent className="max-w-fit border-none bg-transparent outline-none rounded-md flex gap-4 items-center justify-center overflow-hidden">
            <button
              onClick={() => {
                if (visibleStoryIndex > 0) {
                  setPrevVisibleStoryIndex(visibleStoryIndex);
                  setVisibleStoryIndex((prev) => prev - 1);
                }
              }}
              disabled={visibleStoryIndex <= 0}
              className="p-1 rounded-full hover:text-muted-foreground text-background transition-colors disabled:text-muted-foreground z-20"
            >
              <IoIosArrowDropleft className="text-3xl" />
            </button>
            <StoryCard
              currentStoryIndex={visibleStoryIndex}
              prevStoryIndex={prevVisibleStoryIndex}
              _id={user?.stories[visibleStoryIndex]}
              user={user}
              setIsDialogOpen={setIsDialogOpen}
            />
            <button
              onClick={() => {
                if (visibleStoryIndex < user?.stories?.length - 1) {
                  setPrevVisibleStoryIndex(visibleStoryIndex);
                  setVisibleStoryIndex((prev) => prev + 1);
                }
              }}
              disabled={visibleStoryIndex === user?.stories?.length - 1}
              className="p-1 rounded-full hover:text-muted-foreground text-background transition-colors disabled:text-muted-foreground z-20"
            >
              <IoIosArrowDropright className="text-3xl" />
            </button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
export default UserAvatarWithStory;
