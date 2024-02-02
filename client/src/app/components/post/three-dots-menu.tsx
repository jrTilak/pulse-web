import { TiPin } from "react-icons/ti";
import { TbPinnedOff } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { SlOptions } from "react-icons/sl";
import { PiShareFatLight } from "react-icons/pi";
import { LuClipboardList } from "react-icons/lu";
import { MdReportGmailerrorred } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { handlePostShare } from "./utils";
import { IPost } from "@/types/post-types";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import PostHandler from "@/handlers/post-handlers";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function ThreeDotsMenu({
  post,
  isOwner,
  isPinned,
}: {
  post: IPost;
  isOwner: boolean;
  isPinned: boolean;
}) {
  const queryClient = useQueryClient();
  const togglePin = useMutation({
    mutationFn: (isToPin: boolean) =>
      PostHandler.handleTogglePinPost(post._id, isToPin),
    onSuccess: () => {
      toast.success("Post pinned");
      queryClient.invalidateQueries({ queryKey: ["post", post._id] });
    },
    onError: () => {
      toast.error("Failed to pin post");
    },
  });
  const deletePost = useMutation({
    mutationFn: () => PostHandler.handleDeletePost(post._id),
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.removeQueries({ queryKey: ["post", post._id] });
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });
  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.host + `/post/${post._id}`);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleReport = () => {
    setTimeout(() => {
      toast.success("Thank you for your report!");
    }, 500);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-2 py-2">
          <SlOptions className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="left" align="start">
        {isOwner && (
          <>
            {isPinned ? (
              <DropdownMenuItem onClick={() => togglePin.mutate(false)}>
                <TbPinnedOff className="w-4 h-4 mr-2" />
                <span>Unpin Post</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => togglePin.mutate(true)}>
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
            onClick={() => deletePost.mutate()}
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
