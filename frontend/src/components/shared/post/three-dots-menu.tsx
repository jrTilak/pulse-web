import { MdOutlineBookmark, MdOutlineBookmarkBorder } from "react-icons/md";
import { Button } from "../../ui/button";
import { TiPin } from "react-icons/ti";
import { TbPinnedOff } from "react-icons/tb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { RxCross2 } from "react-icons/rx";
import { SlOptions } from "react-icons/sl";
import { PiShareFatLight } from "react-icons/pi";
import { LuClipboardList } from "react-icons/lu";
import { MdReportGmailerrorred } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { PostType } from "@/types/post.types";
import { toast } from "@/hooks/use-toast";
import { handlePostShare } from "./utils";
import PostHandler from "@/handlers/post-handlers";

export function ThreeDotsMenu({
  post,
  setUserPosts,
  isOwner,
  isSaved,
  isPinned,
  togglePostSave,
}: {
  post: PostType;
  setUserPosts?: React.Dispatch<React.SetStateAction<PostType[]>>;
  isOwner: boolean;
  isPinned: boolean;
  togglePostSave: (isToSave: boolean) => Promise<void>;
  isSaved: boolean;
}) {
  const deletePost = async () => {
    const res = await PostHandler.handleDeletePost(post._id);
    if (res.success) {
      setUserPosts &&
        setUserPosts((prev) => prev.filter((p) => p._id !== post._id));
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };
  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.host + `/post/${post._id}`);
      toast({
        title: "Success",
        description: "Link copied successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const togglePin = async (isToPin: boolean) => {
    const res = await PostHandler.handleTogglePinPost(post._id, isToPin);
    if (res.success) {
      setUserPosts &&
        setUserPosts((prev) =>
          prev.map((p) => {
            if (p._id === post._id) {
              return {
                ...p,
                isPinned: isToPin,
              };
            }
            return p;
          })
        );
      toast({
        title: "Success",
        description: "Post pinned successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to pin post",
        variant: "destructive",
      });
    }
  };

  const handleReport = () => {
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Post reported successfully",
        variant: "default",
      });
    }, 500);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <SlOptions className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="left" align="start">
        {isSaved ? (
          <DropdownMenuItem onClick={() => togglePostSave(false)}>
            <MdOutlineBookmark className="w-4 h-4 mr-2 text-primary" />
            <span>Unsave Post</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => togglePostSave(true)}>
            <MdOutlineBookmarkBorder className="w-4 h-4 mr-2 hover:text-primary" />
            <span>Save Post</span>
          </DropdownMenuItem>
        )}

        {isOwner && (
          <>
            {isPinned ? (
              <DropdownMenuItem onClick={() => togglePin(false)}>
                <TbPinnedOff className="w-4 h-4 mr-2" />
                <span>Unpin Post</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => togglePin(true)}>
                <TiPin className="w-4 h-4 mr-2" />
                <span>Pin Post</span>
              </DropdownMenuItem>
            )}
          </>
        )}

        <DropdownMenuItem onClick={() => handlePostShare(post)}>
          <PiShareFatLight className="w-4 h-4 mr-2" />
          <span>Share</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          <LuClipboardList className="w-4 h-4 mr-2" />
          <span>Copy link</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isOwner ? (
          <DropdownMenuItem
            onClick={deletePost}
            className="text-red-500 hover:text-foreground"
          >
            <MdDeleteOutline className="w-4 h-4 mr-2" />
            <span>Delete</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={handleReport}
            className="text-red-500 hover:text-foreground"
          >
            <MdReportGmailerrorred className="w-4 h-4 mr-2" />
            <span>Report</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <RxCross2 className="w-4 h-4 mr-2" />
          <span>Cancel</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
