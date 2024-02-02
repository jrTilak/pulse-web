import { Request, Response, NextFunction } from "express";
import User from "../../schema/User";
import UserAuth from "../../schema/UserAuth";

/**
 * Middleware class for user verification.
 */
export default class UserVerify {
  /**
   * Middleware function to verify if a username already exists in the database.
   * If the username exists, it appends the current timestamp to the username.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The next middleware function.
   */
  public static async verifyUsername(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const body = req.body;
    const isUsernameExist: boolean = await User.findOne({
      username: req.body.username,
    });
    if (isUsernameExist) {
      body.username = `${body.username}_${Date.now()}`;
      return next();
    }
    return next();
  }

  /**
   * Middleware function to verify if the email already exists in the database.
   * If the email exists, it sends a response with status 409 and a message indicating that the email already exists.
   * Otherwise, it calls the next middleware function.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The next middleware function.
   */
  public static async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const isEmailExist: boolean = await UserAuth.findOne({
      email: req.body.email,
    });
    if (isEmailExist) {
      const response = {
        status: 409,
        message: "Email already exists!",
      };
      return res.status(response.status).json(response);
    }
    return next();
  }
}
