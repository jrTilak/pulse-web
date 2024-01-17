import { FaHeart } from "react-icons/fa6";
import { PiChatCircleLight, PiHeartLight } from "react-icons/pi";
import { PiShareFatLight } from "react-icons/pi";
import { MdOutlineBookmark, MdOutlineBookmarkBorder } from "react-icons/md";
import { cn } from "../../../lib/utils";
import { handlePostShare } from "./utils";
import React, { useEffect, useState } from "react";
import { PostType } from "@/types/post.types";
import { useAuthContext } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import Loading from "react-loading";
import CommentsComp from "./comments-comp";
import { motion } from "framer-motion";
import PostHandler from "@/handlers/post-handlers";

const PostReactionFooter = ({
  post,
  togglePostSave,
  isSaved,
  isPostSaving,
}: {
  post: PostType;
  togglePostSave: (isToSave: boolean) => Promise<void>;
  isSaved: boolean;
  isPostSaving: boolean;
}) => {
  const { currentUser } = useAuthContext();
  const [isLiked, setIsLiked] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostType>(post);
  const [isReacting, setIsReacting] = useState(false);
  useEffect(() => {
    if (currentUser) {
      setCurrentPost(post);
    }
  }, [currentUser, post]);

  useEffect(() => {
    setIsLiked(currentPost.likes.includes(currentUser._id));
  }, [currentPost, currentUser]);

  const handleShare = () => {
    handlePostShare(post);
  };

  const toggleLike = async (isToLike: boolean) => {
    setIsReacting(true);
    const res = await PostHandler.handleToggleLikePost(post._id, isToLike);
    setIsReacting(false);
    if (!res.success) {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
      return;
    }
    setCurrentPost(res.data);
  };
  const reactionsButtons = [
    {
      label: "like",
      icon: PiHeartLight,
      active: FaHeart,
      count: currentPost.likes.length,
      action: (isToLike: boolean) => toggleLike(isToLike),
    },
    {
      label: "comment",
      icon: PiChatCircleLight,
      action: () => {},
    },
    {
      label: "share",
      icon: PiShareFatLight,
      action: handleShare,
    },
  ];

  return (
    <div className="flex items-center justify-between mx-4">
      <div className="flex gap-5">
        {reactionsButtons.map((r) => {
          if (r.label === "like") {
            return (
              <React.Fragment key={r.label}>
                {isReacting ? (
                  <Loading type="spin" color="#000" height={20} width={20} />
                ) : isLiked ? (
                  <motion.button
                    layout
                    onClick={() => r.action(false)}
                    className={cn(
                      "inline-flex items-center gap-2 text-red-500 cursor-pointer hover:animate-pulse"
                      //   animation.clicked
                    )}
                  >
                    <r.active className="h-7 w-7 " />
                    <span className="font-semibold">{r.count}</span>
                  </motion.button>
                ) : (
                  <motion.button
                    layout
                    onClick={() => r.action(true)}
                    className="inline-flex items-center gap-2 group cursor-pointer hover:animate-pulse"
                  >
                    <r.icon className=" h-7 w-7 group-hover:text-red-500" />
                    <span className="font-semibold">{r.count}</span>
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
        {isPostSaving ? (
          <Loading type="spin" color="#000" height={20} width={20} />
        ) : isSaved ? (
          <MdOutlineBookmark
            onClick={() => togglePostSave(false)}
            className="w-7 h-7 text-primary"
          />
        ) : (
          <MdOutlineBookmarkBorder
            onClick={() => togglePostSave(true)}
            className="w-7 h-7 hover:text-primary"
          />
        )}
      </div>
    </div>
  );
};
export default PostReactionFooter;
