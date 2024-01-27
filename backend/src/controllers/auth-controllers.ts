import { Request, Response } from "express";
import { compare, hash } from "bcrypt";
import User from "../schema/User";
import UserAuth from "../schema/UserAuth";
import UserPrivateInfo from "../schema/UserPrivateInfo";
import ResponseController from "./reponse-controllers";
import { CookieHandler } from "../utils/cookie-handlers";
import { PASSWORD_SALT_ROUNDS } from "../utils/const";

/**
 * Controller class for user authentication related operations.
 */
class UserAuthController {
  /**
   * Creates a guest user.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns A success response with the created user data or a 500 error response.
   */
  public static createGuestUser = async (req: Request, res: Response) => {
    try {
      const { username, name } = req.body;
      const newUser = new User({
        username,
        name,
      });
      await newUser.save();
      const userAuth = new UserAuth({
        userId: newUser._id,
        method: "guest",
      });
      await userAuth.save();
      const userPrivateInfo = new UserPrivateInfo({
        userId: newUser._id,
      });
      await userPrivateInfo.save();

      // Register cookies
      CookieHandler.registerCookies(res, newUser._id.toString());

      return ResponseController.HandleSuccessResponse(res, {
        status: 201,
        message: "Account created successfully!",
        data: newUser,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Creates a new user with email authentication method.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns A success response with the created user data or a 500 error response.
   */
  public static createEmailUser = async (req: Request, res: Response) => {
    try {
      const { username, name, email, password } = req.body;
      const newUser = new User({
        username,
        name,
      });
      await newUser.save();
      const userAuth = new UserAuth({
        userId: newUser._id,
        method: "email",
        email,
        password: await hash(password, PASSWORD_SALT_ROUNDS),
      });
      await userAuth.save();
      const userPrivateInfo = new UserPrivateInfo({
        userId: newUser._id,
      });
      await userPrivateInfo.save();

      // Register cookies
      CookieHandler.registerCookies(res, newUser._id.toString());

      return ResponseController.HandleSuccessResponse(res, {
        status: 201,
        message: "Account created successfully!",
        data: newUser,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Logs in a user with email authentication method.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns A Promise that resolves to the response object or rejects with an error response.
   */
  public static loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const userAuth = await UserAuth.findOne({ email: email });

      // Check if user exists
      if (!userAuth) {
        return ResponseController.HandleResponseError(res, {
          status: 404,
          message: "User not found, Please create an account!",
          errors: [],
        });
      }

      const isPasswordValid = await compare(
        password,
        userAuth.password.toString() || ""
      );

      // Check if password is valid
      if (!isPasswordValid) {
        return ResponseController.HandleResponseError(res, {
          status: 401,
          message: "Invalid credentials!",
          errors: [],
        });
      }

      // Register cookies
      CookieHandler.registerCookies(res, userAuth.userId.toString());

      //return user data
      const user = await User.findById(userAuth.userId);
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Login successful!",
        data: user,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Verifies the user by checking the user token stored in the cookies.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the response object or rejects with an error response.
   */
  public static verifyUser = async (req: Request, res: Response) => {
    try {
      // Check if user exists
      // res.locals.jwtData.id is the user id from the jwt token returned by the auth middleware called verifyToken
      const user = await User.findById(res.locals.jwtData.id);
      if (!user) {
        return ResponseController.HandleResponseError(res, {
          status: 404,
          message: "User not found!",
          errors: [],
        });
      }

      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "User verified!",
        data: user,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Logout user.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A success response with status 200 and an empty data object.
   */
  public static logoutUser = async (req: Request, res: Response) => {
    try {
      //logout user
      CookieHandler.clearCookies(res);
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Logout successful!",
        data: {},
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };
}

export default UserAuthController;
