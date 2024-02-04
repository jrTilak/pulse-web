import { IUser } from "@/types/user-types";
import { fetchUrl } from "./handler";

export default class UserHandler {
  public static getUserByUsername = (username: string): Promise<IUser> => {
    return fetchUrl<IUser>(`/user/u/${username}`, "GET");
  };

  public static editUserDetails = (
    userDetails: Partial<IUser>
  ): Promise<IUser> => {
    return fetchUrl<IUser>("/user/edit", "PUT", userDetails);
  };

  public static followUser = (
    username: string,
    isToFollow: boolean = true
  ): Promise<{ user: IUser; userToFollow: IUser }> => {
    return fetchUrl<{ user: IUser; userToFollow: IUser }>(
      `/user/u/${username}/follow`,
      isToFollow ? "POST" : "DELETE"
    );
  };

  public static getCurrentUserFollowers = (): Promise<string[]> => {
    return fetchUrl<string[]>("/user/followers", "GET");
  };

  public static getCurrentUserFollowing = (): Promise<string[]> => {
    return fetchUrl<string[]>("/user/following", "GET");
  };

  public static getUserById = (
    userId: string,
    fields?: string[]
  ): Promise<Partial<IUser>> => {
    const qs = fields?.join(",");
    return fetchUrl<Partial<IUser>>(`/user/id/${userId}?q=${qs}`, "GET");
  };

  public static getAllUsers = (neglectUsers: string[]): Promise<IUser[]> => {
    return fetchUrl<IUser[]>(`/user/all?neglectUsers=${neglectUsers.join(",")}`, "GET");
  };

  public static getSuggestedUsers = (): Promise<IUser[]> => {
    return fetchUrl<IUser[]>("/user/suggested-users", "GET");
  };
}
