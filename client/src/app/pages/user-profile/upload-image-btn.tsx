import { Button } from "@/app/components/ui/button";
import { HiOutlineCamera } from "react-icons/hi";
import { cn } from "../../../lib/utils";
import useAuthStore from "@/app/providers/auth-providers";
import toast from "react-hot-toast";
import UserHandler from "@/handlers/user-handlers";
import useUserProfileStore from "@/app/providers/user-profile-provider";

const UploadImageButton = ({
  type,
  setIsPhotoUploading,
  isPhotoUploading,
}: {
  type: "cover" | "profile";
  setIsPhotoUploading: React.Dispatch<
    React.SetStateAction<false | "cover" | "profile">
  >;
  isPhotoUploading: false | "cover" | "profile";
}) => {
  const { setCurrentUser } = useAuthStore((state) => state);
  const { setUser } = useUserProfileStore();
  const handleImageUpload = async () => {
    if (isPhotoUploading) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (file) {
        // Check the file type
        if (!file.type.startsWith("image/")) {
          toast.error("Only image files are allowed.");
          return;
        }

        // Check the file size
        const fileSizeInMB = file.size / (1024 * 1024);
        const maxSizeInMB = 5;
        if (fileSizeInMB > maxSizeInMB) {
          toast.error(`File size should be less than ${maxSizeInMB} MB.`);
          return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result as string;
          setIsPhotoUploading(type);
          const data =
            type === "cover"
              ? { coverImg: base64Data }
              : { profileImg: base64Data };
          UserHandler.editUserDetails(data)
            .then((res) => {
              setCurrentUser(res);
              setUser(res);
            })
            .catch((err) => {
              toast.error(err.message);
            })
            .finally(() => {
              setIsPhotoUploading(false);
            });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };
  return (
    <div
      onClick={handleImageUpload}
      className={cn(
        "absolute group opacity-60 cursor-pointer",
        type === "cover"
          ? "bottom-2 right-2"
          : "bottom-2 right-2 p-2 bg-muted rounded-full"
      )}
    >
      {type === "cover" ? (
        <Button className="flex items-center gap-2" variant="secondary">
          <HiOutlineCamera className="w-4 h-4" />
          <span className="hidden transition-all duration-200 transform translate-x-full group-hover:translate-x-0 group-hover:inline-block">
            Upload Image
          </span>
        </Button>
      ) : (
        <HiOutlineCamera className="w-6 h-6 text-foreground hover:text-primary" />
      )}
    </div>
  );
};
export default UploadImageButton;
