import { useEffect, useMemo, useRef, useState } from "react";
import CreatePostCard from "@/app/components/cards/create-post-card";
import { cn } from "@/lib/utils";
import { shadow } from "@/assets/constants/styles";
import SuggestedUsers from "./suggested-users";
import SadSvg from "@/assets/svg/individual/sad.svg";
import PostComponent from "@/app/components/post/post-component";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostHandler from "@/handlers/post-handlers";
import { Button } from "@/app/components/ui/button";
import StoriesList from "@/app/components/stories/stories-list";
// import StoriesList from "@/app/components/stories/stories-list";
//todo - not working
const FeedPage = () => {
  const postRef = useRef<HTMLDivElement>(null);
  const [postsIds, setPostsIds] = useState<string[]>([]);
  const { data, fetchNextPage, isError } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: () => PostHandler.getRelevantPost(postsIds),
    getNextPageParam: (lastPage) => {
      return lastPage._id;
    },
    initialPageParam: "", // Add this line
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data?.pages) {
      const ids = data.pages.map((page) => page._id).flat();
      setPostsIds(ids);
    }
    console.log(data);
  }, [data]);

  const loadMore = useMemo(() => {
    return () => {
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          fetchNextPage();
        }, 100 * i);
      }
    };
  }, []);

  useEffect(() => {
    loadMore();
  }, []);

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
        {data?.pages.map((post) => (
          <PostComponent
            post={post}
            key={post._id}
            isLoading={false || !post}
          />
        ))}
        {isError ? (
          <div className="flex flex-col w-full items-center gap1 justify-center">
            <img src={SadSvg} className="w-32" />
            <p className="text-gray-400 text-lg font-semibold">
              You watched all the posts!
            </p>
          </div>
        ) : (
          <Button onClick={() => loadMore()} className="w-full mt-4">
            Load more
          </Button>
        )}
      </div>
      <div className="flex-col gap-4 items-start justify-start hidden md:flex col-span-2 lg:col-span-3">
        <SuggestedUsers />
      </div>
    </div>
  );
};
export default FeedPage;
