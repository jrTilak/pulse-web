import { TbMessageCirclePlus } from "react-icons/tb";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import UserHandler from "@/handlers/user-handlers";
import ChatUtils from "@/utils/chat-utils";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/types/user-types";
import UserImageOnly from "@/app/components/avatars/user-image-only";

const NewChatButton = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const { data: currentUser } = useQuery<IUser>({
    queryKey: ["currentUser"],
  });
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchUsers"],
    queryFn: () => UserHandler.getAllUsers([currentUser?._id || ""]),
  });

  useEffect(() => {
    if (query === "") {
      setFilteredUsers(users || []);
      return;
    }
    const filteredUsers = users?.filter((user) =>
      user.username
        .toLowerCase()
        .includes(query.toLowerCase().split(" ").join("_"))
    );
    setFilteredUsers(filteredUsers || []);
  }, [query, users]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;

  return (
    <Dialog open={isOpened} onOpenChange={() => setQuery("")}>
      <DialogTrigger onClick={() => setIsOpened(true)}>
        <Button variant="secondary">
          <TbMessageCirclePlus className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors" />
        </Button>
      </DialogTrigger>
      <DialogContent onBlur={() => setIsOpened(false)}>
        <Button
          variant="ghost"
          onClick={() => setIsOpened(false)}
          className="absolute top-2 right-2"
        >
          <IoCloseOutline className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors" />
        </Button>
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
        </DialogHeader>
        <ScrollArea className="w-full max-h-[80vh] h-full">
          <div className="flex flex-col gap-2">
            <DialogDescription className="flex gap-2 mb-2 flex-col">
              <span>Search for users to start a chat with</span>
              <form>
                <div className="relative">
                  <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                    <IoSearchOutline className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="search"
                    id="default-search"
                    autoComplete="off"
                    className="block w-full py-2 text-sm bg-gray-200 rounded-md outline-none text-muted-foreground p-x-4 ps-10"
                    placeholder="Search by username"
                    required
                  />
                </div>
              </form>
            </DialogDescription>
            <div className="flex flex-col">
              {filteredUsers.map((user) => (
                <Avatar
                  currentUser={currentUser as IUser}
                  setIsOpened={setIsOpened}
                  user={user}
                  key={user?._id}
                  q={query}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
export default NewChatButton;

const Avatar = ({
  user,
  currentUser,
  setIsOpened,
  q,
}: {
  user: IUser;
  currentUser: IUser;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  q: string;
}) => {
  const splitUserName = user.username
    .toLowerCase()
    .split(q.toLowerCase().split(" ").join("_"));

  return (
    <Link
      onClick={() => setIsOpened(false)}
      to={`/chats/${ChatUtils.createChatId(user._id, currentUser?._id || "")}`}
      key={user._id}
      className="flex items-center gap-2 hover:bg-muted px-4 py-2 cursor-pointer rounded-md transition-colors"
    >
      <UserImageOnly img={user.profileImg} name={user.name} />
      <div className="flex flex-col">
        <h5 className="mb-1 text-base truncate text-muted-foreground">
          {user.name}
        </h5>
        <p className="mb-0 text-xs truncate text-muted-foreground">
          {splitUserName.map((part, index) => (
            <span key={index}>
              {part}
              {index !== splitUserName.length - 1 && (
                <span className="bg-primary text-primary-foreground">{q}</span>
              )}
            </span>
          ))}
        </p>
      </div>
    </Link>
  );
};
