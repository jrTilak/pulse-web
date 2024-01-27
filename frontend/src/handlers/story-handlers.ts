import { ServiceResponseType } from "@/types/handler-response.types";
import { UserStoryType } from "@/types/story.types";
import { fetchUrl } from "./handler";

export default class StoryHandler {
  public static getUserStoryById = async (
    storyId: string
  ): Promise<ServiceResponseType<UserStoryType>> => {
    return fetchUrl<UserStoryType>(`/story/id/${storyId}`, "GET");
  };

  public static deleteUserStoryById = async (
    storyId: string
  ): Promise<ServiceResponseType<UserStoryType>> => {
    return fetchUrl<UserStoryType>(`/story/id/${storyId}`, "DELETE");
  };

  public static createNewStory = (
    storyType: "text" | "image" | "video",
    story: string,
    storyConfig?: UserStoryType["storyConfig"]
  ): Promise<ServiceResponseType<UserStoryType>> => {
    return fetchUrl<UserStoryType>(`/story/new/story/${storyType}`, "POST", {
      content: story,
      storyConfig,
    });
  };

  public static viewUserStoryById = async (
    storyId: string
  ): Promise<ServiceResponseType<UserStoryType>> => {
    return fetchUrl<UserStoryType>(`/story/id/${storyId}/view`, "PUT");
  };

  public static likeUserStoryById = async (
    storyId: string
  ): Promise<ServiceResponseType<UserStoryType>> => {
    return fetchUrl<UserStoryType>(`/story/id/${storyId}/like`, "PUT");
  };

  public static unlikeUserStoryById = async (
    storyId: string
  ): Promise<ServiceResponseType<UserStoryType>> => {
    return fetchUrl<UserStoryType>(`/story/id/${storyId}/like`, "DELETE");
  };

  public static getFollowingUserStories = async (): Promise<
    ServiceResponseType<UserStoryType[]>
  > => {
    return fetchUrl<UserStoryType[]>("/story/following", "GET");
  };
}
