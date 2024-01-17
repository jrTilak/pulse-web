import { AVATAR_PLACEHOLDER } from "@/assets/constants/placeholders";
import { cn } from "@/lib/utils";
import { UserType } from "@/types/user.types";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { useState } from "react";
import StoryCard from "../cards/story-card";

const UserAvatar = ({
  user,
  className,
  height,
  width,
  containerClassName,
}: {
  user: UserType;
  className?: string;
  height?: number;
  width?: number;
  containerClassName?: string;
}) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [visibleStoryIndex, setVisibleStoryIndex] = useState(0);
  const [prevVisibleStoryIndex, setPrevVisibleStoryIndex] = useState(0);
  const handleAvatarClick = () => {
    if (user.stories?.length === 0) {
      return navigate(`/u/${user.username}`);
    }
    setIsDialogOpen(true);
  };

  return (
    <>
      <div
        onClick={handleAvatarClick}
        className={cn(
          "items-center justify-center flex mb-2 cursor-pointer",
          containerClassName
        )}
      >
        <img
          height={height}
          width={width}
          className={cn(
            "relative object-cover object-center rounded-full h-36 w-36",
            className,
            user.stories?.length && "ring-2 ring-primary"
          )}
          src={user.profileImg || AVATAR_PLACEHOLDER}
          alt={user.name}
        />
      </div>
      {user.stories.length > 0 && (
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
              _id={user.stories[visibleStoryIndex]}
              user={user}
              setIsDialogOpen={setIsDialogOpen}
            />
            <button
              onClick={() => {
                if (visibleStoryIndex < user.stories.length - 1) {
                  setPrevVisibleStoryIndex(visibleStoryIndex);
                  setVisibleStoryIndex((prev) => prev + 1);
                }
              }}
              disabled={visibleStoryIndex === user.stories.length - 1}
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
export default UserAvatar;
