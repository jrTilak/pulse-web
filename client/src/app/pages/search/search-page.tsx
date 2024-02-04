import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import {
  AVATAR_PLACEHOLDER,
  COVER_PLACEHOLDER,
} from "@/assets/constants/placeholders";
import UserHandler from "@/handlers/user-handlers";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/types/user-types";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Button } from "@/app/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import sadSvg from "@/assets/svg/individual/sad.svg";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
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
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filteredUsers || []);
  }, [query, users]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;

  return (
    <ScrollArea className="w-full h-full p-4 lg:p-12 max-w-2xl mx-auto ">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 mb-6 flex-col">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                <IoSearchOutline className="w-4 h-4 text-muted-foreground" />
              </div>
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setSearchParams({ q: e.target.value });
                  setQuery(e.target.value);
                }}
                type="search"
                id="default-search"
                autoComplete="off"
                className="block w-full py-2 text-sm bg-gray-200 rounded-md outline-none text-muted-foreground p-x-4 ps-10"
                placeholder="Search by name..."
                required
              />
            </div>
          </form>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
          {filteredUsers.map((user) => (
            <SearchUserAvatar key={user._id} user={user} q={query} />
          ))}
          {filteredUsers.length === 0 && query !== "" && (
            <div className="flex flex-col items-center justify-center w-full m-auto col-span-2">
              <p className="text-center text-lg text-muted-foreground flex flex-col gap-2">
                <img src={sadSvg} alt="" className="w-32 h-full" />
                No users found
              </p>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};
export default SearchPage;

const SearchUserAvatar = ({ user, q }: { user: IUser; q: string }) => {
  const splitName = user.name.toLowerCase().split(q.toLowerCase());
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="border bg-muted transition-shadow shadow-xl hover:shadow-xl w-full rounded-md"
      >
        <div className="w-full border-b border-slate-300">
          <img
            src={user.coverImg || COVER_PLACEHOLDER}
            className="h-36 w-full object-cover rounded-md rounded-b-none"
          />
        </div>
        <div className="flex items-center p-4">
          <div className="relative flex flex-col items-center w-full">
            <div className="h-24 w-24 md rounded-full avatar items-end justify-end text-primary min-w-max relative -top-16 flex bg-muted-foreground row-start-1 row-end-3">
              <img
                className="h-24 w-24 md rounded-full relative object-cover object-center"
                src={user.profileImg || AVATAR_PLACEHOLDER}
                alt=""
              />
            </div>
            <div className="flex flex-col justify-center items-center -mt-14 w-full">
              <span className="text-md whitespace-nowrap font-semibold">
                {splitName.map((part, index) => (
                  <span key={index}>
                    {part}
                    {index !== splitName.length - 1 && (
                      <span className="bg-primary">{q}</span>
                    )}
                  </span>
                ))}{" "}
                <span className="text-muted-foreground font-normal">
                  (
                  {user.username.length > 15
                    ? user.username.substring(0, 15) + "..."
                    : user.username}
                  )
                </span>
              </span>
              <div className="py-2 flex">
                <Link to={`/u/${user.username}`}>
                  <Button variant="outline">Visit Profile</Button>
                </Link>
              </div>
              <div className="flex justify-center items-center w-full divide-x divide-gray-400 divide-solid">
                <span className="text-center px-2">
                  <span className="font-bold text-gray-700">
                    {user.followers}{" "}
                  </span>
                  <span className="text-gray-600">followers</span>
                </span>
                <span className="text-center px-2">
                  <span className="font-bold text-gray-700">
                    {user.following}{" "}
                  </span>
                  <span className="text-gray-600">following</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
