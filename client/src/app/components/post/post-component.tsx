import { Link } from "react-router-dom";
import { cn } from "../../../lib/utils";
import { TiPin } from "react-icons/ti";
import { motion } from "framer-motion";
import { shadow } from "@/assets/constants/styles";
import { BsDot } from "react-icons/bs";
import { ThreeDotsMenu } from "./three-dots-menu";
import TextPost from "./text-post";
import ImagesPost from "./image-post";
import VideoPlayer from "./video-player";
import AudioPlayer from "./audio-player";
import PostReactionFooter from "./post-reaction-footer";
import UserAvatar from "../avatars/user-avatar";
import DateUtils from "@/utils/date-utils";
import { IPost } from "@/types/post-types";
import { Skeleton } from "../ui/skeleton";
import useAuthStore from "@/app/providers/auth-providers";

interface PostComponentProps {
  post: IPost;
  isPinned: boolean;
  isLoading: boolean;
}

const PostComponent = ({
  post,
  isPinned = false,
  isLoading = false,
}: PostComponentProps) => {
  const { currentUser } = useAuthStore((state) => state);
  return (
    <motion.div
      layout
      className={cn(
        "p-4 py-6 relative rounded-md flex flex-col gap-4 justify-between max-h-[80vh]",
        shadow.sm
      )}
    >
      {!isLoading && isPinned && (
        <TiPin className="absolute top-0 right-0 w-6 h-6 text-primary" />
      )}
      <div className="flex items-center justify-between">
        {!isLoading ? (
          <Link
            to={`/u/${post?.owner?.username}`}
            className="flex items-center px-4 group justify-center"
          >
            <UserAvatar
              user={post?.owner}
              className="w-10 h-10"
              containerClassName=" mb-0"
            />

            <div className="ml-3 ">
              <span className="text-sm antialiased font-semibold leading-tight group-hover:text-primary">
                {post?.owner?.name}
              </span>

              <div className="flex gap-1 text-muted-foreground ">
                <span className="block text-xs text-muted-foreground">
                  @{post?.owner?.username}
                </span>
                <BsDot className="w-4 h-4" />
                <span className="text-xs">
                  {DateUtils.getTimeElapsed(post?.createdAt)}
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex items-center px-4 group justify-center ">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-20 h-6 ml-3" />
          </div>
        )}
        {!isLoading ? (
          <ThreeDotsMenu
            isOwner={post?.owner?._id === currentUser?._id}
            isPinned={isPinned}
            post={post}
          />
        ) : (
          <Skeleton className="w-12 h-8" />
        )}
      </div>
      {post?.content?.text && (
        <TextPost isLoading={isLoading} content={post?.content?.text} />
      )}
      {!isLoading ? (
        <>
          {post?.content?.images && (
            <ImagesPost
              images={post.content.images}
              layout={post.content.imagesLayout}
            />
          )}
          {post?.content?.video && <VideoPlayer video={post?.content?.video} />}
          {post?.content?.audio && <AudioPlayer audio={post?.content?.audio} />}
        </>
      ) : (
        <Skeleton className="h-40" />
      )}
      <PostReactionFooter
        isLoading={isLoading}
        post={post}
        isSaved={false} //todo
      />
    </motion.div>
  );
};
export default PostComponent;
