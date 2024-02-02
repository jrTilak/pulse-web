import z from "zod";
import { Request, Response, NextFunction } from "express";
import ResponseController from "../../controllers/reponse-controllers";

export default class UserValidator {
  /**
   * Validates the request body for editing user details.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next middleware function.
   */
  public static validateEditUserDetails = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const EditUserDetailsSchema = z.object({
      name: z.string().min(3).max(40).optional(),
      username: z.string().min(3).max(40).optional(),
      profileImg: z.string().default("").optional(),
      coverImg: z.string().default("").optional(),
      bio: z.string().default("").optional(),
      updatedAt: z
        .string()
        .default(() => new Date().toISOString())
        .optional(),
      lastSeen: z
        .string()
        .default(() => new Date().toISOString())
        .optional(),
      isOnline: z.boolean().default(false).optional(),
    });

    try {
      const body = req.body;
      EditUserDetailsSchema.parse(body);
      next();
    } catch (error) {
      return ResponseController.HandleUnprocessableEntityError(res, error);
    }
  };
}
