import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { IPost } from "@/types/post-types";
import { useState } from "react";
import { IoIosArrowDropright } from "react-icons/io";
import { PiChatCircleLight } from "react-icons/pi";
import Loading from "react-loading";
import Comment from "./comment";
import { ArrayUtils } from "@/utils/array-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PostHandler from "@/handlers/post-handlers";
import toast from "react-hot-toast";

const CommentsComp = ({ post }: { post: IPost }) => {
  const queryClient = useQueryClient();
  const [commentVal, setCommentVal] = useState("");
  const comment = useMutation({
    mutationFn: () => PostHandler.handleAddCommentToPost(commentVal, post?._id),
    onError: () => toast.error("Failed to add comment"),
    onSuccess: () => {
      toast.success("Thanks for your comment!");
      setCommentVal("");
      queryClient.invalidateQueries({ queryKey: ["post", post?._id || ""] });
    },
  });
  return (
    <Sheet>
      <SheetTrigger>
        <PiChatCircleLight
          className="cursor-pointer h-7 w-7 hover:text-primary"
          //   onClick={r.action}
        />
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 max-h-full">
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col gap-2 w-full h-full">
          {post?.comments?.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full m-auto text-muted-foreground">
              No comments yet
            </div>
          ) : (
            ArrayUtils.sortByCreatedAt(post?.comments).map((c, i) => (
              <Comment comment={c} key={i} />
            ))
          )}
        </ScrollArea>
        <div className="flex-grow"></div>{" "}
        {/* div to push the form to the bottom */}
        <form className="flex self-end w-full gap-1">
          <input
            type="text"
            autoFocus
            value={commentVal}
            onChange={(e) => setCommentVal(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
          />
          <Button
            onClick={(e) => {
              e.preventDefault();
              comment.mutate();
            }}
            variant="secondary"
            type="submit"
            className="p-2 rounded"
          >
            {comment.isPending ? (
              <Loading type="spin" color="black" height={20} width={20} />
            ) : (
              <IoIosArrowDropright className="w-6 h-6" />
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CommentsComp;
