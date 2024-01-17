import { CommentType, PostContentType } from "@/validators/post.validators";
import { fetchUrl } from "./handler";
import { PostType } from "@/types/post.types";
import { ServiceResponseType } from "@/types/handler-response.types";

export default class PostHandler {
  public static createANewPost = (
    post: PostContentType
  ): Promise<ServiceResponseType<PostType>> => {
    return fetchUrl<PostType>("/post/new", "POST", post);
  };

  public static getUsersAllPosts = (
    username: string
  ): Promise<ServiceResponseType<PostType[]>> => {
    return fetchUrl<PostType[]>(`/post/${username}/all`, "GET");
  };

  public static createADraft = (
    post: PostContentType
  ): Promise<ServiceResponseType<PostType>> => {
    return fetchUrl<PostType>("/post/draft", "POST", post);
  };

  public static getSavedPosts = (
    username: string
  ): Promise<ServiceResponseType<string[]>> => {
    return fetchUrl<string[]>(`/post/${username}/saved-posts`, "GET");
  };

  public static handleDeletePost = (
    postId: string
  ): Promise<ServiceResponseType<string[]>> => {
    return fetchUrl<string[]>(`/post/${postId}`, "DELETE");
  };

  public static handleTogglePinPost = (
    postId: string,
    isToPin: boolean
  ): Promise<ServiceResponseType<string[]>> => {
    return fetchUrl<string[]>(
      `/post/${postId}/pin`,
      isToPin ? "POST" : "DELETE"
    );
  };

  public static handleToggleSavePost = (
    postId: string,
    isToSave: boolean
  ): Promise<ServiceResponseType<string[]>> => {
    return fetchUrl<string[]>(
      `/post/${postId}/save`,
      isToSave ? "POST" : "DELETE"
    );
  };

  public static handleToggleLikePost = (
    postId: string,
    isToLike: boolean
  ): Promise<ServiceResponseType<PostType>> => {
    return fetchUrl<PostType>(
      `/post/${postId}/like`,
      isToLike ? "POST" : "DELETE"
    );
  };

  public static handleAddCommentToPost = (
    comment: CommentType,
    postId: string
  ): Promise<ServiceResponseType<PostType["comments"]>> => {
    return fetchUrl<PostType["comments"]>(`/post/${postId}/comment`, "POST", {
      comment,
    });
  };

  public static getRelevantPosts = (): Promise<
    ServiceResponseType<PostType[]>
  > => {
    return fetchUrl<PostType[]>("/post/relevant", "GET");
  };
}
