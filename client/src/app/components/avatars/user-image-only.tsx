import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const UserImageOnly = ({
  img,
  isOnline,
  className,
  name,
  userId,
}: {
  img: string | undefined;
  isOnline?: boolean | undefined;
  className?: string;
  name: string;
  userId?: string;
}) => {
  const navigate = useNavigate();
  const len = name.split(" ").length;
  const initials =
    len > 1
      ? name.split(" ")[0][0] + name.split(" ")[1][0]
      : name[0] + name[1] || "U";

  const onClick = () => {
    if (userId) {
      navigate(`/u/${userId}`);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn("relative", userId ? "cursor-pointer" : "cursor-default")}
    >
      <Avatar className={className}>
        <AvatarImage src={img} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      {isOnline === undefined ? null : (
        <div
          className={cn(
            "absolute bottom-0 right-0 w-3 h-3 opacity-90 rounded-full border-2 border-white",
            isOnline ? "bg-primary" : "bg-muted-foreground"
          )}
        />
      )}
    </div>
  );
};

export default UserImageOnly;
