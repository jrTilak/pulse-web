import { UserType } from "@/types/user.types";
import {
  EmailUserType,
  GuestUserType,
  LoginCredentialsType,
} from "@/validators/auth-validators";
import { ServiceResponseType } from "../types/handler-response.types";
import { fetchUrl } from "./handler";

export class UserAuthHandler {
  public static createGuestUser(
    user: GuestUserType
  ): Promise<ServiceResponseType<UserType>> {
    return fetchUrl<UserType>("/auth/guest", "POST", user);
  }

  public static createEmailUser(
    user: EmailUserType
  ): Promise<ServiceResponseType<UserType>> {
    return fetchUrl<UserType>("/auth/email", "POST", user);
  }

  public static loginUser(
    user: LoginCredentialsType
  ): Promise<ServiceResponseType<UserType>> {
    return fetchUrl<UserType>("/auth/login", "POST", user);
  }

  public static verifyUser(): Promise<ServiceResponseType<UserType>> {
    return fetchUrl<UserType>("/auth/verify", "GET");
  }

  public static logoutUser(): Promise<ServiceResponseType<null>> {
    return fetchUrl<null>("/auth/logout", "POST");
  }
}
