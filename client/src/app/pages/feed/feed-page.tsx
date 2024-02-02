import { useRef } from "react";
import CreatePostCard from "@/app/components/cards/create-post-card";
import { cn } from "@/lib/utils";
import { shadow } from "@/assets/constants/styles";
import SuggestedUsers from "./suggested-users";
import SadSvg from "@/assets/svg/individual/sad.svg";
import { useQuery } from "@tanstack/react-query";
import PostHandler from "@/handlers/post-handlers";
import StoriesList from "@/app/components/stories/stories-list";
import PostComponent from "./post-comp";

const FeedPage = () => {
  const postRef = useRef<HTMLDivElement>(null);
  const { data, isError } = useQuery({
    queryKey: ["feedPostsIds"],
    queryFn: () => PostHandler.getRelevantPostsId([]),
    staleTime: Infinity,
  });

  return (
    <div className="md:p-12 p-4 sm:px-8 md:grid grid-cols-8 w-full  gap-3 lg:gap-8 max-w-5xl m-auto">
      <div
        ref={postRef}
        className="flex flex-col gap-4 col-span-6 lg:col-span-5"
      >
        <div className={cn("flex gap-1 p-4 rounded-md", shadow.sm)}>
          <StoriesList />
        </div>
        <CreatePostCard />
        {data?.map((id) => (
          <PostComponent key={id} postId={id} />
        ))}
        {isError && (
          <div className="flex flex-col w-full items-center gap1 justify-center">
            <img src={SadSvg} className="w-32" />
            <p className="text-gray-400 text-lg font-semibold">
              You watched all the posts!
            </p>
          </div>
        )}
      </div>
      <div className="flex-col gap-4 items-start justify-start hidden md:flex col-span-2 lg:col-span-3">
        <SuggestedUsers />
      </div>
    </div>
  );
};
export default FeedPage;
