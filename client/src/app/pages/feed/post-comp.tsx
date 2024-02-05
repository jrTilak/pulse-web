import { Link } from "react-router-dom";
import { cn } from "../../../lib/utils";
import { motion } from "framer-motion";
import { shadow } from "@/assets/constants/styles";
import { BsDot } from "react-icons/bs";
import DateUtils from "@/utils/date-utils";
import { IPost } from "@/types/post-types";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/types/user-types";
import PostHandler from "@/handlers/post-handlers";
import { Skeleton } from "@/app/components/ui/skeleton";
import { ThreeDotsMenu } from "@/app/components/post/three-dots-menu";
import TextPost from "@/app/components/post/text-post";
import ImagesPost from "@/app/components/post/image-post";
import VideoPlayer from "@/app/components/post/video-player";
import AudioPlayer from "@/app/components/post/audio-player";
import PostReactionFooter from "@/app/components/post/post-reaction-footer";
import UserImageOnly from "@/app/components/avatars/user-image-only";

interface PostComponentProps {
  postId: string;
}

const PostComponent = ({ postId }: PostComponentProps) => {
  const { data: currentUser } = useQuery<IUser, string>({
    queryKey: ["currentUser"],
  });
  const { data: savedPosts = [] } = useQuery<string[]>({
    queryKey: ["savedPosts"],
  });
  const { data: post, isLoading } = useQuery<IPost, string>({
    queryKey: ["post", postId],
    queryFn: () => PostHandler.getPostById(postId),
    staleTime: Infinity,
  });
  return (
    <motion.div
      layout
      className={cn(
        "p-4 py-6 relative rounded-md flex flex-col gap-4 justify-between max-h-[80vh]",
        shadow.sm
      )}
    >
      <div className="flex items-center justify-between">
        {!isLoading ? (
          <Link
            to={`/u/${post?.owner?.username}`}
            className="flex items-center px-4 group justify-center"
          >
            <UserImageOnly
              img={post?.owner?.profileImg}
              name={post?.owner?.name || ""}
              isOnline={post?.owner?.isOnline}
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
                  {DateUtils.getTimeElapsed(post?.createdAt as string)}
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
            isPinned={false}
            post={post as IPost}
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
        post={post as IPost}
        isSaved={savedPosts?.includes(post?._id as string)}
      />
    </motion.div>
  );
};
export default PostComponent;
