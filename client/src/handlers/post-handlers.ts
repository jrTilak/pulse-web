import { fetchUrl } from "./handler";
import { IPost, IPostComment, IPostContent } from "@/types/post-types";

export default class PostHandler {
  public static createANewPost = (post: IPostContent): Promise<IPost> => {
    return fetchUrl<IPost>("/post/new", "POST", post);
  };

  public static getUsersAllPosts = (username: string): Promise<IPost[]> => {
    return fetchUrl<IPost[]>(`/post/${username}/all`, "GET");
  };

  public static createADraft = (post: IPostContent): Promise<IPost> => {
    return fetchUrl<IPost>("/post/draft", "POST", post);
  };

  public static getSavedPosts = (username: string): Promise<string[]> => {
    return fetchUrl<string[]>(`/post/${username}/saved-posts`, "GET");
  };

  public static handleDeletePost = (postId: string): Promise<string[]> => {
    return fetchUrl<string[]>(`/post/${postId}`, "DELETE");
  };

  public static handleTogglePinPost = (
    postId: string,
    isToPin: boolean
  ): Promise<string[]> => {
    return fetchUrl<string[]>(
      `/post/${postId}/pin`,
      isToPin ? "POST" : "DELETE"
    );
  };

  public static handleToggleSavePost = (
    postId: string,
    isToSave: boolean
  ): Promise<string[]> => {
    return fetchUrl<string[]>(
      `/post/${postId}/save`,
      isToSave ? "POST" : "DELETE"
    );
  };

  public static handleToggleLikePost = (
    postId: string,
    isToLike: boolean
  ): Promise<IPost> => {
    return fetchUrl<IPost>(
      `/post/${postId}/like`,
      isToLike ? "POST" : "DELETE"
    );
  };

  public static handleAddCommentToPost = (
    comment: string,
    postId: string
  ): Promise<string> => {
    return fetchUrl<string>(`/post/${postId}/comment`, "POST", {
      comment,
    });
  };

  public static getRelevantPost = (neglect: string[]): Promise<IPost> => {
    return fetchUrl<IPost>("/post/relevant", "GET", { neglect });
  };
  public static getPostById = (postId: string): Promise<IPost> => {
    return fetchUrl<IPost>(`/post/id/${postId}`, "GET");
  };
}
