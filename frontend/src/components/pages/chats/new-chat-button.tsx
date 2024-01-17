import { TbMessageCirclePlus } from "react-icons/tb";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { ScrollArea } from "../../ui/scroll-area";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { UserType } from "@/types/user.types";
import { useAuthContext } from "@/hooks/use-auth";
import { AVATAR_PLACEHOLDER } from "@/assets/constants/placeholders";
import UserHandler from "@/handlers/user-handlers";
import ChatUtils from "@/utils/chat-utils";

const NewChatButton = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const { currentUser } = useAuthContext();
  const [isOpened, setIsOpened] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    (async () => {
      const res = await UserHandler.getAllUsers();
      if (!res.success) return;
      const filteredUsers = res.data.filter(
        (user) => user._id !== currentUser._id
      );
      setUsers(filteredUsers);
    })();
  }, [currentUser._id]);

  useEffect(() => {
    if (query === "") {
      setFilteredUsers(users);
      return;
    }
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filteredUsers);
  }, [query, users]);

  return (
    <Dialog open={isOpened}>
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
                    placeholder="Search users"
                    required
                  />
                </div>
              </form>
            </DialogDescription>
            <div className="flex flex-col">
              {filteredUsers.map((user) => (
                <Link
                  onClick={() => setIsOpened(false)}
                  to={`/chats/${ChatUtils.createChatId(user._id, currentUser._id)}`}
                  key={user._id}
                  className="flex items-center gap-2 hover:bg-muted px-4 py-2 cursor-pointer rounded-md transition-colors"
                >
                  <img
                    className="w-10 h-10 rounded-full object-cover object-center"
                    src={user.profileImg || AVATAR_PLACEHOLDER}
                    alt=""
                  />
                  <div className="flex flex-col">
                    <h5 className="mb-1 text-base truncate text-muted-foreground">
                      {user.name}
                    </h5>
                    <p className="mb-0 text-xs truncate text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
export default NewChatButton;