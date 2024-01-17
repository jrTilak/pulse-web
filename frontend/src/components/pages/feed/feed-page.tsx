import { useEffect, useState } from "react";
import CreatePostCard from "@/components/shared/cards/create-post-card";
import { cn } from "@/lib/utils";
import { shadow } from "@/assets/constants/styles";
import { PostType } from "@/types/post.types";
import PostComponent from "@/components/shared/post/post-component";
import StoriesList from "@/components/shared/stories/stories-list";
import SuggestedUsers from "./suggested-users";
import PostHandler from "@/handlers/post-handlers";

const FeedPage = () => {
  const [posts, setPosts] = useState([] as PostType[]);
  useEffect(() => {
    const action = async () => {
      const posts = await PostHandler.getRelevantPosts();
      if (posts.success) setPosts(posts.data as PostType[]);
    };
    action();
  }, []);

  return (
    <div className="md:p-12 p-4 sm:px-8 md:grid grid-cols-8 w-full  gap-3 lg:gap-8 max-w-5xl m-auto">
      <div className="flex flex-col gap-4 col-span-6 lg:col-span-5">
        <div className={cn("flex gap-1 p-4 rounded-md", shadow.sm)}>
          <StoriesList />
        </div>
        <CreatePostCard />
        {posts.map((post, i) => (
          <PostComponent
            post={post}
            key={post._id}
            noDelay={i === 0}
            setUserPosts={setPosts}
          />
        ))}
      </div>
      <div className="flex-col gap-4 items-start justify-start hidden md:flex col-span-2 lg:col-span-3">
        <SuggestedUsers />
      </div>
    </div>
  );
};
export default FeedPage;
