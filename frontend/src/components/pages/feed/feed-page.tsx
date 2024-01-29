import CreatePostCard from "@/components/shared/cards/create-post-card";
import { cn } from "@/lib/utils";
import { shadow } from "@/assets/constants/styles";
import PostComponent from "@/components/shared/post/post-component";
import StoriesList from "@/components/shared/stories/stories-list";
import SuggestedUsers from "./suggested-users";
import PostHandler from "@/handlers/post-handlers";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PostType } from "@/types/post.types";
import { create } from "zustand";

interface FeedStore {
  posts: PostType[];
  setNewPosts: (posts: PostType[]) => void;
  deletePost: (postId: string) => void;
  updatePost: (postId: string, newData: Partial<PostType>) => void;
}

export const useFeedStore = create<FeedStore>((set) => ({
  posts: [],
  setNewPosts: (posts) => {
    set((state) => ({ ...state, posts: [...posts, ...state.posts] }));
  },
  deletePost: (postId) => {
    set((state) => ({
      ...state,
      posts: state.posts.filter((post) => post._id !== postId),
    }));
  },
  updatePost: (postId, newData) => {
    set((state) => ({
      ...state,
      posts: state.posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            ...newData,
          };
        }
        return post;
      }),
    }));
  },
}));

const FeedPage = () => {
  const [posts, setPosts] = useState<PostType[]>();
  const { data } = useQuery<PostType>({
    queryKey: ["feed"],
    queryFn: ()=>PostHandler.getRelevantPost(posts?.map((post) => post._id)),
    staleTime: Infinity,
    retry: 3,
  });

  useEffect(() => {
    setPosts(data);
  }, [data]);

  return (
    <div className="md:p-12 p-4 sm:px-8 md:grid grid-cols-8 w-full  gap-3 lg:gap-8 max-w-5xl m-auto">
      <div className="flex flex-col gap-4 col-span-6 lg:col-span-5">
        <div className={cn("flex gap-1 p-4 rounded-md", shadow.sm)}>
          <StoriesList />
        </div>
        <CreatePostCard />
        {posts?.map((post, i) => (
          <PostComponent post={post} key={post._id} noDelay={i === 0} />
        ))}
      </div>
      <div className="flex-col gap-4 items-start justify-start hidden md:flex col-span-2 lg:col-span-3">
        <SuggestedUsers />
      </div>
    </div>
  );
};
export default FeedPage;
