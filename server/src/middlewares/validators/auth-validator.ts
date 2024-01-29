import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import ResponseController from "../../controllers/reponse-controllers";
import AuthUtils from "../../utils/auth-utils";

/**
 * A class that provides validation schemas and methods for authentication related operations.
 */
export class AuthValidator {
  /**
   * Schema for validating guest user data.
   */
  public static guestUserSchema = z.object({
    name: z.string().min(3).max(20),
    username: z.string().min(3).max(20).startsWith("guest_"),
    method: z.array(z.literal("guest")).default(["guest"]),
  });

  /**
   * Schema for validating email user data.
   */
  public static emailUserSchema = z.object({
    name: z.string().min(3).max(40),
    username: z.string().min(3).max(40),
    method: z.array(z.literal("email")).default(["email"]),
    email: z.string().email(),
    password: z.string().min(8).max(20),
  });

  /**
   * Schema for validating login credentials.
   */
  public static loginCredentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(20),
  });

  /**
   * Validates the request body for creating a new user.
   */
  public static validateNewUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const method = req.url === "/guest" ? "guest" : "email";
      req.body.username = AuthUtils.createUsername(req.body.name, method);
      const newUserSchema =
        req.url === "/guest"
          ? AuthValidator.guestUserSchema
          : AuthValidator.emailUserSchema;
      newUserSchema.parse(req.body);
      return next();
    } catch (error) {
      return ResponseController.HandleUnprocessableEntityError(res, error);
    }
  }

  /**
   * Validates the request body for login credentials.
   */
  public static validateLoginCredentials(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      AuthValidator.loginCredentialsSchema.parse(req.body);
      return next();
    } catch (error) {
      return ResponseController.HandleUnprocessableEntityError(res, error);
    }
  }
}
