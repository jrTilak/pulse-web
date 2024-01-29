import { MdOutlineEdit } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import ReactLoading from "react-loading";
import { shadow } from "@/assets/constants/styles";
import useAuthStore from "@/app/providers/auth-providers";
import useUserProfileStore from "@/app/providers/user-profile-provider";
import UserHandler from "@/handlers/user-handlers";
import toast from "react-hot-toast";

const UserBio = () => {
  const { currentUser, setCurrentUser } = useAuthStore((state) => state);
  const [isEditing, setIsEditing] = useState(false);
  const [oldBio, setOldBio] = useState(currentUser?.bio || "");
  const bioRef = useRef<HTMLParagraphElement>(null);
  const { user, setUser } = useUserProfileStore();
  const isOwner = user?.username === currentUser?.username;
  const [isBioUpdating, setIsBioUpdating] = useState(false);
  useEffect(() => {
    setOldBio(currentUser?.bio || "Bio Not Found");
  }, [currentUser?.bio]);

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
    bioRef.current.contentEditable = "false";
    bioRef.current.innerText = oldBio;
  };

  const handleUserBioUpdate = async () => {
    if (!bioRef.current || isBioUpdating) return;
    setIsBioUpdating(true);
    UserHandler.editUserDetails({
      bio: bioRef.current.innerText,
    })
      .then((user) => {
        setCurrentUser(user);
        setUser(user);
      })
      .catch((err) => {
        toast.error(err);
      })
      .finally(() => {
        setIsBioUpdating(false);
        setIsEditing(false);
        bioRef.current?.blur();
        if (bioRef.current) bioRef.current.contentEditable = "false";
      });
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
