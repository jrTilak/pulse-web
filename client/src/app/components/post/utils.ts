import { IPost } from "@/types/post-types";

export const handlePostShare = (post: IPost) => {
  const url = `${window.location.origin}/post/${post._id}`;
  const title = post.content.text;
  const text = post.content.text;
  if (navigator.share) {
    navigator
      .share({
        title,
        text,
        url,
      })
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error));
  } else {
    console.log("Web Share API not supported in your browser");
  }
};
