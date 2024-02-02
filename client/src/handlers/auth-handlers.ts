import { IUser } from "@/types/user-types";
import {
  EmailUserType,
  LoginCredentialsType,
} from "@/validators/auth-validators";
import { fetchUrl } from "./handler";

export class UserAuthHandler {
  public static createGuestUser(name: string): Promise<IUser> {
    return fetchUrl<IUser>("/auth/guest", "POST", { name });
  }

  public static createEmailUser(user: EmailUserType): Promise<IUser> {
    return fetchUrl<IUser>("/auth/email", "POST", user);
  }

  public static loginUser(user: LoginCredentialsType): Promise<IUser> {
    return fetchUrl<IUser>("/auth/login", "POST", user);
  }

  public static verifyUser(): Promise<IUser> {
    return fetchUrl<IUser>("/auth/verify", "GET");
  }

  public static logoutUser(): Promise<null> {
    return fetchUrl<null>("/auth/logout", "POST");
  }
}
