import { AVATAR_PLACEHOLDER } from "@/assets/constants/placeholders";
import { cn } from "@/lib/utils";

const UserImageOnly = ({
  img,
  isOnline,
  className,
}: {
  img: string;
  isOnline: boolean;
  className?: string;
}) => {
  return (
    <div className="relative">
      <img
        className={cn(
          "h-12 w-12 rounded-full object-cover object-center mb-2 aspect-square",
          className
        )}
        src={img || AVATAR_PLACEHOLDER}
        alt=""
      />
      {isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full" />
      )}
    </div>
  );
};

export default UserImageOnly;