import { CommentType, PostContentType } from "@/validators/post.validators";
import { fetchUrl } from "./handler";
import { PostType } from "@/types/post.types";
import { ServiceResponseType } from "@/types/handler-response.types";

export const createANewPost = (
  post: PostContentType
): Promise<ServiceResponseType<PostType>> => {
  return fetchUrl<PostType>("/post/new", "POST", post);
};

export const getUsersAllPosts = (
  username: string
): Promise<ServiceResponseType<PostType[]>> => {
  return fetchUrl<PostType[]>(`/post/${username}/all`, "GET");
};

export const createADraft = (
  post: PostContentType
): Promise<ServiceResponseType<PostType>> => {
  return fetchUrl<PostType>("/post/draft", "POST", post);
};

export const getSavedPosts = (
  username: string
): Promise<ServiceResponseType<string[]>> => {
  return fetchUrl<string[]>(`/post/${username}/saved-posts`, "GET");
};

export const handleDeletePost = (
  postId: string
): Promise<ServiceResponseType<string[]>> => {
  return fetchUrl<string[]>(`/post/${postId}`, "DELETE");
};

export const handleTogglePinPost = (
  postId: string,
  isToPin: boolean
): Promise<ServiceResponseType<string[]>> => {
  return fetchUrl<string[]>(`/post/${postId}/pin`, isToPin ? "POST" : "DELETE");
};

export const handleToggleSavePost = (
  postId: string,
  isToSave: boolean
): Promise<ServiceResponseType<string[]>> => {
  return fetchUrl<string[]>(
    `/post/${postId}/save`,
    isToSave ? "POST" : "DELETE"
  );
};

export const handleToggleLikePost = (
  postId: string,
  isToLike: boolean
): Promise<ServiceResponseType<PostType>> => {
  return fetchUrl<PostType>(
    `/post/${postId}/like`,
    isToLike ? "POST" : "DELETE"
  );
};

export const handleAddCommentToPost = (
  comment: CommentType,
  postId: string
): Promise<ServiceResponseType<PostType["comments"]>> => {
  return fetchUrl<PostType["comments"]>(`/post/${postId}/comment`, "POST", {
    comment,
  });
};

export const getRelevantPosts = (): Promise<
  ServiceResponseType<PostType[]>
> => {
  return fetchUrl<PostType[]>("/post/relevant", "GET");
};
