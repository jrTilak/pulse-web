import { shadow } from "@/assets/constants/styles";
import { cn } from "@/lib/utils";
import { UserStoryType } from "@/types/story.types";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { UserType } from "@/types/user.types";
import { useNavigate } from "react-router-dom";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { TiMediaPause, TiMediaPlay } from "react-icons/ti";
import { TbVolume, TbVolume3 } from "react-icons/tb";
import { useAuthContext } from "@/hooks/use-auth";
import { MdRemoveRedEye } from "react-icons/md";
import { AVATAR_PLACEHOLDER } from "@/assets/constants/placeholders";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";
import { CiWarning } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import UserHandler from "@/handlers/user-handlers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import Loading from "react-loading";
import StoryHandler from "@/handlers/story-handlers";
import DateUtils from "@/utils/date-utils";

const StoryCard = ({
  _id,
  user,
  setIsDialogOpen,
  currentStoryIndex,
  prevStoryIndex,
}: {
  _id: string;
  user: UserType;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentStoryIndex: number;
  prevStoryIndex: number;
}) => {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();
  const [content, setContent] = useState({} as UserStoryType);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  useEffect(() => {
    const action = async () => {
      const res = await StoryHandler.getUserStoryById(_id);
      if (!res.success)
        return toast({
          title: "Error",
          description: res.message,
          variant: "destructive",
        });
      setContent(res.data);
      setIsLoading(false);
      if (currentUser._id !== content.createdBy) {
        await StoryHandler.viewUserStoryById(_id);
      }
    };
    action();
  }, [_id]);

  const toggleStoryLike = async (toLike: boolean) => {
    if (isLiking) return;
    setIsLiking(true);
    const toRun = toLike
      ? StoryHandler.likeUserStoryById
      : StoryHandler.unlikeUserStoryById;
    const res = await toRun(_id);
    setIsLiking(false);
    if (!res.success)
      return toast({
        title: "Error",
        description: res.message,
        variant: "destructive",
      });
    console.log(res.data);
    setContent(res.data);
  };

  if (isLoading) {
    return (
      <Skeleton className="bg-muted max-w-72 w-72 rounded-md flex items-center justify-center flex-col cursor-pointer aspect-[3/5] overflow-hidden p-4" />
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        onClick={() => setIsDrawerOpen(false)}
        key={content._id}
        initial={{
          x: currentStoryIndex >= prevStoryIndex ? 100 : -100,
          opacity: 0,
          scale: 0,
        }}
        animate={{ x: 0, opacity: 1, scale: 1, transition: { duration: 0.4 } }}
        exit={{
          x: currentStoryIndex >= prevStoryIndex ? -100 : 100,
          opacity: 0,
          scale: 0,
          position: "absolute",
        }}
        className={cn(
          "bg-muted relative max-w-72 rounded-md flex items-center justify-center flex-col aspect-[3/5] overflow-hidden",
          shadow.sm,
          content.type === "text" ? "p-4" : ""
        )}
      >
        {isDrawerOpen && (
          <ViewersList
            viewers={content.views}
            likes={content.likes}
            setIsDialogOpen={setIsDialogOpen}
          />
        )}
        <StoryCardThreeDotsMenu content={content} />
        {content.type === "text" && (
          <p className="text-lg font-semibold text-wrap overflow-hidden text-center break-words">
            {content.content}
          </p>
        )}

        {content.type === "image" && (
          <img
            src={content.content}
            alt="story"
            className="object-cover object-center w-full h-full rounded-md"
          />
        )}
        {content.type === "video" && <VideoPlayerCard src={content.content} />}
        <div className="flex absolute bottom-4 left-4 gap-2 items-center">
          <img
            onClick={() => {
              navigate(`/u/${user.username}`);
              setIsDialogOpen(false);
            }}
            className=" w-8 h-8 object-cover object-center rounded-full cursor-pointer"
            src={user.profileImg || AVATAR_PLACEHOLDER}
            alt={user.name}
          />
          <p className="text-xs font-light text-wrap overflow-hidden break-words text-muted-foreground">
            {DateUtils.getTimeElapsed(content.createdAt)}
          </p>
        </div>

        {currentUser._id === user._id ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDrawerOpen(true);
            }}
            className="absolute bottom-4 right-4 w-8 h-8 object-cover object-center rounded-full group"
          >
            <MdRemoveRedEye className="text-3xl text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        ) : (
          <>
            {isLiking ? (
              <Loading
                type="spin"
                color="#000"
                height={20}
                width={20}
                className="absolute bottom-4 right-4 w-8 h-8 object-cover object-center rounded-full group"
              />
            ) : content.likes.includes(currentUser._id) ? (
              <button
                onClick={() => toggleStoryLike(false)}
                className="absolute bottom-4 right-4 w-8 h-8 object-cover object-center rounded-full group"
              >
                <IoMdHeart className="text-3xl  text-muted-foreground text-red-500 transition-colors" />
              </button>
            ) : (
              <button
                onClick={() => toggleStoryLike(true)}
                className="absolute bottom-4 right-4 w-8 h-8 object-cover object-center rounded-full group"
              >
                <IoMdHeartEmpty className="text-3xl text-primary group-hover:text-red-500 transition-colors" />
              </button>
            )}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
export default StoryCard;

const VideoPlayerCard = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const handleMuteToggle = (setMute: boolean) => {
    setIsMuted(setMute);
  };
  const handlePlayToggle = (setPlay: boolean) => {
    setIsPlaying(setPlay);
    if (setPlay) {
      videoPlayerRef.current?.play();
    } else {
      videoPlayerRef.current?.pause();
    }
  };
  return (
    <div
      onClick={() => handlePlayToggle(!isPlaying)}
      className="relative w-full h-full rounded-md overflow-hidden flex items-center justify-center"
    >
      <video
        ref={videoPlayerRef}
        src={src}
        className=" object-contain object-center"
        controls={false}
        autoPlay={true}
        loop={true}
        muted={isMuted}
        playsInline={true}
        onPlay={() => handlePlayToggle(true)}
        onPause={() => handlePlayToggle(false)}
      />
      <div className="controls flex top-2 left-2 absolute z-40">
        {isPlaying ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayToggle(false);
            }}
            className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity"
          >
            <TiMediaPause className="text-3xl" />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayToggle(true);
            }}
            className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity"
          >
            <TiMediaPlay className="text-3xl" />
          </button>
        )}
        {isMuted ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMuteToggle(false);
            }}
            className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity z-50"
          >
            <TbVolume3 className="text-2xl" />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMuteToggle(true);
            }}
            className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity z-50"
          >
            <TbVolume className="text-2xl" />
          </button>
        )}
      </div>
    </div>
  );
};

const StoryCardThreeDotsMenu = ({ content }: { content: UserStoryType }) => {
  const { currentUser, setCurrentUser } = useAuthContext();
  const handleDeleteStory = async () => {
    const res = await StoryHandler.deleteUserStoryById(content._id);
    if (!res.success)
      return toast({
        title: "Error",
        description: res.message,
        variant: "destructive",
      });
    toast({
      title: "Deleted",
      description: "Your story has been deleted.",
    });
    setCurrentUser((prev) => ({
      ...prev,
      stories: prev.stories.filter((id) => id !== content._id),
    }));
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
            <HiOutlineDotsHorizontal className="text-2xl" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {currentUser._id === content.createdBy ? (
            <DropdownMenuItem
              onClick={handleDeleteStory}
              className="flex gap-1 items-center"
            >
              <MdDeleteOutline className="text-lg text-red-800" />
              <span>Delete story</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                setTimeout(() => {
                  toast({
                    title: "Reported",
                    description: "We will review this story soon.",
                  });
                }, 1000);
                //todo: report story
              }}
              className="flex gap-1 items-center"
            >
              <CiWarning className="text-lg text-red-800" />
              <span>Report story</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ViewersList = ({
  viewers,
  likes,
  setIsDialogOpen,
}: {
  viewers: UserStoryType["views"];
  likes: UserStoryType["likes"];
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.2 } }}
        exit={{ y: 100, opacity: 0 }}
        className="w-full border-t border-muted-foreground h-[80%] bg-muted rounded-t-md absolute bottom-0 z-50 flex flex-col p-2 pt-4"
      >
        <p className="text-sm font-semibold text-muted-foreground mb-3">
          Views ({viewers.length}) Likes ({likes.length}){" "}
        </p>
        {viewers.length > 0 ? (
          viewers.map((viewer) => (
            <Viewer
              key={viewer}
              viewer={viewer}
              likes={likes}
              setIsDialogOpen={setIsDialogOpen}
            />
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No viewers yet
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

const Viewer = ({
  viewer,
  likes,
  setIsDialogOpen,
}: {
  viewer: string;
  likes: string[];
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [user, setUser] = useState(null as Partial<UserType> | null);
  const navigate = useNavigate();
  useEffect(() => {
    const action = async () => {
      const res = await UserHandler.getUserById(viewer, [
        "username",
        "profileImg",
        "name",
      ]);
      if (!res.success) return;
      setUser(res.data);
    };
    action();
  }, [viewer]);

  return (
    <div
      onClick={() => {
        setIsDialogOpen(false);
        navigate(`/u/${user?.username}`);
        console.log(user);
      }}
      className="flex cursor-pointer items-center gap-2 rounded-md justify-between hover:bg-gray-200 transition-colors p-2"
    >
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <img
              className="w-7 h-7 object-cover object-center rounded-full"
              src={user.profileImg || AVATAR_PLACEHOLDER}
              alt="viewer"
            />
            <p className="text-sm font-semibold text-muted-foreground">
              {user.name}
            </p>
          </>
        ) : (
          <>
            <Skeleton className="w-7 h-7 rounded-full" />
            <Skeleton className="w-32 h-5 rounded-md" />
          </>
        )}
      </div>
      {likes.includes(viewer) && <IoMdHeart className="text-red-500 text-lg" />}
    </div>
  );
};
