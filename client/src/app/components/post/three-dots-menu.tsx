import { MdOutlineBookmark, MdOutlineBookmarkBorder } from "react-icons/md";
import { TiPin } from "react-icons/ti";
import { TbPinnedOff } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { SlOptions } from "react-icons/sl";
import { PiShareFatLight } from "react-icons/pi";
import { LuClipboardList } from "react-icons/lu";
import { MdReportGmailerrorred } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { handlePostShare } from "./utils";
import PostHandler from "@/handlers/post-handlers";
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

export function ThreeDotsMenu({
  post,
  isOwner,
  isSaved,
  isPinned,
}: {
  post: IPost;
  isOwner: boolean;
  isPinned: boolean;
  isSaved: boolean;
}) {
  const deletePost = async () => {};
  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.host + `/post/${post._id}`);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const togglePin = async (isToPin: boolean) => {};

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
        {isSaved ? (
          <DropdownMenuItem
          // onClick={() => togglePostSave(false)}
          >
            <MdOutlineBookmark className="w-4 h-4 mr-2 text-primary" />
            <span>Unsave Post</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
          // onClick={() => togglePostSave(true)}
          >
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
