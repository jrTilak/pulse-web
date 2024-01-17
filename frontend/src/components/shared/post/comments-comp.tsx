import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthContext } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { PostType } from "@/types/post.types";
import PostValidator, { CommentType } from "@/validators/post.validators";
import { useState } from "react";
import { IoIosArrowDropright } from "react-icons/io";
import { PiChatCircleLight } from "react-icons/pi";
import Loading from "react-loading";
import Comment from "./comment";
import PostHandler from "@/handlers/post-handlers";
import { ArrayUtils } from "@/utils/array-utils";

const CommentsComp = ({ post }: { post: PostType }) => {
  const { currentUser } = useAuthContext();
  const [commentVal, setCommentVal] = useState("");
  const [comments, setComments] = useState<CommentType[]>(post.comments);

  const [isCommenting, setIsCommenting] = useState(false);

  const addComment = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (isCommenting) return;
    const data = PostValidator.validateComment({
      content: commentVal,
      createdBy: currentUser._id,
    });
    if (!data.success) {
      setIsCommenting(false);
      toast({
        title: "Error",
        description: "Comment must be between 1 and 600 characters",
        variant: "destructive",
      });
      return;
    }
    setIsCommenting(true);
    const res = await PostHandler.handleAddCommentToPost(data.data, post._id);
    setIsCommenting(false);
    if (!res.success) {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive",
      });
      return;
    }
    setComments(res.data);
    setCommentVal("");
  };

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
          {comments.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full m-auto text-muted-foreground">
              No comments yet
            </div>
          ) : (
            ArrayUtils.sortByCreatedAt(comments).map((c, i) => (
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
            onClick={(e) => addComment(e)}
            variant="secondary"
            type="submit"
            className="p-2 rounded"
          >
            {isCommenting ? (
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
