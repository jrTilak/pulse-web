import { NextFunction, Request, Response } from "express";
import z from "zod";
import ResponseController from "../../controllers/reponse-controllers";
/**
 * Class representing a FileValidator.
 */
export default class FileValidator {
  /**
   * Schema for uploading a file.
   */
  public static uploadFileSchema = z.object({
    content: z.string(),
    name: z.string().min(1).max(255),
  });

  /**
   * Validates the request body for uploading a file.
   */
  public static validateFileToUpload(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      FileValidator.uploadFileSchema.parse(req.body);
      return next();
    } catch (error) {
      return ResponseController.HandleUnprocessableEntityError(res, error);
    }
  }
}
