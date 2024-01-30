import { FaHeart } from "react-icons/fa6";
import { PiChatCircleLight, PiHeartLight } from "react-icons/pi";
import { PiShareFatLight } from "react-icons/pi";
import { MdOutlineBookmark, MdOutlineBookmarkBorder } from "react-icons/md";
import { cn } from "../../../lib/utils";
import React, { useEffect, useState } from "react";
import Loading from "react-loading";
import CommentsComp from "./comments-comp";
import { motion } from "framer-motion";
import { IPost } from "@/types/post-types";
import useAuthStore from "@/app/providers/auth-providers";
import { Skeleton } from "../ui/skeleton";

const PostReactionFooter = ({
  post,
  isSaved,
  isLoading,
}: {
  post: IPost;
  isSaved: boolean;
  isLoading: boolean;
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const reactionsButtons = [
    {
      label: "like",
      icon: PiHeartLight,
      active: FaHeart,
      count: 0,
      action: () => {},
    },
    {
      label: "comment",
      icon: PiChatCircleLight,
      action: () => {},
    },
    {
      label: "share",
      icon: PiShareFatLight,
      action: () => {},
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
                    {isLiked ? (
                      <motion.button
                        layout
                        // onClick={() => r.action(false)}
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
                        // onClick={() => r.action(true)}
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
                <button
                  // onClick={() => r.action(true)}
                  key={r.label}
                >
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
            // onClick={() => togglePostSave(false)}
            className="w-7 h-7 text-primary"
          />
        ) : (
          <MdOutlineBookmarkBorder
            // onClick={() => togglePostSave(true)}
            className="w-7 h-7 hover:text-primary"
          />
        )}
      </div>
    </div>
  );
};
export default PostReactionFooter;
