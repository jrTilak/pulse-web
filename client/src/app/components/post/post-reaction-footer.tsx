import { FaHeart } from "react-icons/fa6";
import { PiChatCircleLight, PiHeartLight } from "react-icons/pi";
import { PiShareFatLight } from "react-icons/pi";
import { MdOutlineBookmark, MdOutlineBookmarkBorder } from "react-icons/md";
import { cn } from "../../../lib/utils";
import CommentsComp from "./comments-comp";
import { motion } from "framer-motion";
import { IPost } from "@/types/post-types";
import { Skeleton } from "../ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PostHandler from "@/handlers/post-handlers";
import { handlePostShare } from "./utils";
import React from "react";
import { IUser } from "@/types/user-types";

const PostReactionFooter = ({
  post,
  isSaved,
  isLoading,
}: {
  post: IPost;
  isSaved: boolean;
  isLoading: boolean;
}) => {
  const queryClient = useQueryClient();
  const { data: currentUser } = useQuery<IUser, string>({
    queryKey: ["currentUser"],
  });

  const toggleLike = useMutation({
    mutationFn: (isToLike: boolean) =>
      PostHandler.handleToggleLikePost(post._id, isToLike),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", post._id] });
    },
  });

  const togglePostSave = useMutation({
    mutationFn: (isToSave: boolean) =>
      PostHandler.handleToggleSavePost(post._id, isToSave),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", post._id] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    },
  });

  const reactionsButtons = [
    {
      label: "like",
      icon: PiHeartLight,
      active: FaHeart,
      action: (isToLike: boolean) => {
        toggleLike.mutate(isToLike);
      },
    },
    {
      label: "comment",
      icon: PiChatCircleLight,
      action: () => {},
    },
    {
      label: "share",
      icon: PiShareFatLight,
      action: () => {
        handlePostShare(post);
      },
    },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-5">
        {isLoading
          ? reactionsButtons.map(() => {
              return <Skeleton key={Math.random()} className="w-7 h-7" />;
            })
          : reactionsButtons.map((r) => {
              if (r.label === "like") {
                return (
                  <React.Fragment key={r.label}>
                    {post.likes.includes(currentUser?._id as string) ? (
                      <motion.button
                        layout
                        onClick={() => r.action(false)}
                        className={cn(
                          "inline-flex items-center gap-2 text-red-500 cursor-pointer hover:animate-pulse"
                          //   animation.clicked
                        )}
                      >
                        <r.active className="h-7 w-7 " />
                        <span className="font-semibold">
                          {post.likes.length}
                        </span>
                      </motion.button>
                    ) : (
                      <motion.button
                        layout
                        onClick={() => r.action(true)}
                        className="inline-flex items-center gap-2 group cursor-pointer hover:animate-pulse"
                      >
                        <r.icon className=" h-7 w-7 group-hover:text-red-500" />
                        <span className="font-semibold">
                          {post.likes.length}
                        </span>
                      </motion.button>
                    )}
                  </React.Fragment>
                );
              }
              if (r.label === "comment") {
                return <CommentsComp key={r.label} post={post} />;
              }
              return (
                <button onClick={() => r.action(true)} key={r.label}>
                  <r.icon className="cursor-pointer h-7 w-7 hover:text-primary" />
                </button>
              );
            })}
      </div>
      <div className="flex cursor-pointer">
        {isLoading ? (
          <Skeleton className="w-7 h-7" />
        ) : isSaved ? (
          <MdOutlineBookmark
            onClick={() => togglePostSave.mutate(false)}
            className="w-7 h-7 text-primary"
          />
        ) : (
          <MdOutlineBookmarkBorder
            onClick={() => togglePostSave.mutate(true)}
            className="w-7 h-7 hover:text-primary"
          />
        )}
      </div>
    </div>
  );
};
export default PostReactionFooter;
