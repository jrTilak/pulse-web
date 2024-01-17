import { Link } from "react-router-dom";
import { cn } from "../../../lib/utils";
import { useEffect, useState } from "react";
import { TiPin } from "react-icons/ti";
import { toast } from "../../../hooks/use-toast";
import { motion } from "framer-motion";
import { PostType } from "@/types/post.types";
import { useAuthContext } from "@/hooks/use-auth";
import { shadow } from "@/assets/constants/styles";
import { BsDot } from "react-icons/bs";
import { ThreeDotsMenu } from "./three-dots-menu";
import TextPost from "./text-post";
import ImagesPost from "./image-post";
import VideoPlayer from "./video-player";
import AudioPlayer from "./audio-player";
import PostReactionFooter from "./post-reaction-footer";
import UserAvatar from "../avatars/user-avatar";
import PostHandler from "@/handlers/post-handlers";
import DateUtils from "@/utils/date-utils";

interface PostComponentProps {
  post: PostType;
  setUserPosts?: React.Dispatch<React.SetStateAction<PostType[]>>;
  isPinned?: boolean;
  noDelay?: boolean;
}

const PostComponent = ({
  post,
  setUserPosts,
  isPinned = false,
}: // noDelay = false,
PostComponentProps) => {
  const { currentUser, savedPostsId, setSavedPostsId } = useAuthContext();
  const [isOwner, setIsOwner] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPostSaving, setIsPostSaving] = useState(false);

  useEffect(() => {
    setIsOwner(currentUser.username === post.owner.username);
    setIsSaved(savedPostsId.includes(post._id));
  }, [currentUser, post, savedPostsId]);

  const togglePostSave = async (isToSave: boolean) => {
    setIsPostSaving(true);
    const res = await PostHandler.handleToggleSavePost(post._id, isToSave);
    setIsPostSaving(false);
    if (!res.success) {
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive",
      });
      return;
    }
    if (isToSave) {
      setSavedPostsId((prev) => [...prev, post._id]);
      toast({
        title: "Success",
        description: "Post saved successfully",
      });
      return;
    }
    setSavedPostsId((prev) => prev.filter((id) => id !== post._id));
    toast({
      title: "Success",
      description: "Post unsaved successfully",
    });
    return;
  };

  return (
    <motion.div
      layout
      className={cn(
        "p-4 py-6 relative rounded-md flex flex-col gap-4 justify-between max-h-[80vh]",
        shadow.sm
      )}
    >
      {isPinned && (
        <>
          <TiPin className="absolute top-0 right-0 w-6 h-6 text-primary" />
        </>
      )}
      <div className="flex items-center justify-between">
        <Link
          to={`/u/${post.owner.username}`}
          className="flex items-center px-4 group justify-center"
        >
          <UserAvatar
            user={post.owner}
            className="w-10 h-10"
            containerClassName=" mb-0"
          />

          <div className="ml-3 ">
            <span className="text-sm antialiased font-semibold leading-tight group-hover:text-primary">
              {post.owner.name}
            </span>

            <div className="flex gap-1 text-muted-foreground ">
              <span className="block text-xs text-muted-foreground">
                @{post.owner.username}
              </span>
              <BsDot className="w-4 h-4" />
              <span className="text-xs">{DateUtils.getTimeElapsed(post.createdAt)}</span>
            </div>
          </div>
        </Link>
        <ThreeDotsMenu
          isOwner={isOwner}
          isSaved={isSaved}
          post={post}
          setUserPosts={setUserPosts}
          isPinned={isPinned}
          togglePostSave={togglePostSave}
        />
      </div>
      {post.content?.text && <TextPost content={post.content.text} />}
      {post.content?.images && (
        <ImagesPost
          images={post.content.images}
          layout={post.content.imagesLayout}
        />
      )}
      {post.content?.video && <VideoPlayer video={post.content.video} />}
      {post.content?.audio && <AudioPlayer audio={post.content.audio} />}

      <PostReactionFooter
        post={post}
        togglePostSave={togglePostSave}
        isSaved={isSaved}
        isPostSaving={isPostSaving}
      />
    </motion.div>
  );
};
export default PostComponent;
