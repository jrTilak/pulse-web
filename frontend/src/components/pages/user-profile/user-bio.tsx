import { MdOutlineEdit } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";
import ReactLoading from "react-loading";
import { useToast } from "../../../hooks/use-toast";
import { useAuthContext } from "@/hooks/use-auth";
import { useProfilePageContext } from "@/hooks/use-profile-page";
import { shadow } from "@/assets/constants/styles";
import UserHandler from "@/handlers/user-handlers";
import { StringUtils } from "@/utils/string-utils";

const UserBio = () => {
  const { currentUser, setCurrentUser } = useAuthContext();
  const { isOwner, user } = useProfilePageContext();
  const [isEditing, setIsEditing] = useState(false);
  const [oldBio, setOldBio] = useState(currentUser?.bio || "");
  const bioRef = useRef<HTMLParagraphElement>(null);
  const [isBioUpdating, setIsBioUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setOldBio(currentUser?.bio || "");
  }, [currentUser?.bio]);

  const handleUserBioUpdate = async () => {
    setIsBioUpdating(true);
    const res = await UserHandler.editUserDetails({
      bio: StringUtils.removeNewLineAndTrim(bioRef.current?.innerText || ""),
    });
    setIsBioUpdating(false);

    if (!res.success) {
      toast({
        title: "Failed",
        description: "Something went wrong, Try again later",
        variant: "destructive",
      });
      return;
    }

    setCurrentUser(res.data);
  };

  const handleBioEdit = () => {
    if (!isOwner) return;
    const target = bioRef.current;
    if (!target) return;
    target.contentEditable = "true";
    target.focus();
    setIsEditing(true);
  };

  const handleBioEditCancel = () => {
    setIsEditing(false);
    if (!bioRef.current) return;
    bioRef.current?.blur();
    bioRef.current.innerText = oldBio;
  };

  return (
    <>
      {isOwner && !isBioUpdating && (
        <Button
          variant="secondary"
          onClick={handleBioEdit}
          className={cn(
            "absolute w-8 h-8 p-1 rounded-full right-2 top-2 sm:hidden group-hover:block",
            shadow.sm
          )}
        >
          <MdOutlineEdit className="w-5 h-5" />
        </Button>
      )}

      <p
        ref={bioRef}
        className="relative p-2 leading-tight cursor-pointer "
        suppressContentEditableWarning={true}
        autoCorrect="false"
        spellCheck="false"
        contentEditable={false}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        {user?.bio || "Bio Not Found"}
        {
          isBioUpdating && (
            <div className="absolute inset-0 flex items-center justify-center bg-black rounded-md bg-opacity-40">
              <ReactLoading type="spin" color="#fff" height={30} width={30} />
            </div>
          ) /* <!-- Online Status Badge --> */
        }
      </p>

      {isEditing && (
        <div className="grid grid-cols-3 gap-4">
          <Button
            onClick={handleBioEditCancel}
            variant="ghost"
            className="col-span-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUserBioUpdate}
            variant="secondary"
            className="col-span-2"
          >
            Save
          </Button>
        </div>
      )}
      <hr className="bg-muted" />
    </>
  );
};
export default UserBio;
