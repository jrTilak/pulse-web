import { Response } from "express";
import { createToken } from "./token-manager";

/**
 * A utility class for handling cookies.
 */
export class CookieHandler {
  /**
   * Handles cookies by clearing existing cookies and setting new ones.
   * @param res - The express.js response object.
   * @param userId - The user ID.
   */
  public static registerCookies(res: Response, userId: string) {
    // clear cookies
    CookieHandler.clearCookies(res);

    // set cookies
    const token = createToken(userId, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie("auth_token", token, {
      path: "/",
      domain: process.env.FRONTEND_DOMAIN,
      expires: expires,
      httpOnly: true,
      signed: true,
      sameSite: "none",
      secure: true,
    });
  }

  /**
   * Clears the existing cookies.
   * @param res - The response object.
   */
  public static clearCookies(res: Response) {
    res.clearCookie("auth_token", {
      httpOnly: true,
      domain: process.env.FRONTEND_DOMAIN,
      signed: true,
      path: "/",
      sameSite: "none",
      secure: true,
    });
  }
}
