import { UserType } from "@/types/user.types";
import { UserStoryType } from "@/types/story.types";
import { ServiceResponseType } from "@/types/handler-response.types";
import { fetchUrl } from "./handler";

export default class UserHandler {
  public static getUserByUsername = (
    username: string
  ): Promise<ServiceResponseType<UserType>> => {
    return fetchUrl<UserType>(`/user/u/${username}`, "GET");
  };

  public static editUserDetails = (
    userDetails: Partial<UserType>
  ): Promise<ServiceResponseType<UserType>> => {
    return fetchUrl<UserType>("/user/edit", "PUT", userDetails);
  };

  public static followUser = (
    username: string,
    isToFollow: boolean = true
  ): Promise<
    ServiceResponseType<{ user: UserType; userToFollow: UserType }>
  > => {
    return fetchUrl<{ user: UserType; userToFollow: UserType }>(
      `/user/u/${username}/follow`,
      isToFollow ? "POST" : "DELETE"
    );
  };

  public static getCurrentUserFollowers = (): Promise<
    ServiceResponseType<string[]>
  > => {
    return fetchUrl<string[]>("/user/followers", "GET");
  };

  public static getCurrentUserFollowing = (): Promise<
    ServiceResponseType<string[]>
  > => {
    return fetchUrl<string[]>("/user/following", "GET");
  };

  public static createNewStory = (
    storyType: "text" | "image" | "video",
    story: string
  ): Promise<ServiceResponseType<UserStoryType>> => {
    return fetchUrl<UserStoryType>(`/user/new/story/${storyType}`, "POST", {
      content: story,
    });
  };

  public static getUserById = (
    userId: string,
    fields?: string[]
  ): Promise<ServiceResponseType<Partial<UserType>>> => {
    const qs = fields?.join(",");
    return fetchUrl<Partial<UserType>>(`/user/id/${userId}?q=${qs}`, "GET");
  };

  public static getAllUsers = (): Promise<ServiceResponseType<UserType[]>> => {
    return fetchUrl<UserType[]>("/user/all", "GET");
  };

  public static getSuggestedUsers = (): Promise<
    ServiceResponseType<UserType[]>
  > => {
    return fetchUrl<UserType[]>("/user/suggested-users", "GET");
  };
}
