import { NextFunction, Request, Response } from "express";
import z from "zod";
import ResponseController from "../../controllers/reponse-controllers";

export class PostValidator {
  /**
   * Validates the request body for creating a post.
   */
  public static validatePost(req: Request, res: Response, next: NextFunction) {
    const postSchema = z.object({
      content: z.object({
        text: z.string().min(1).max(600),
        images: z.array(z.string().url()).max(3).optional(),
        imagesLayout: z
          .union([
            z.literal("vertical"),
            z.literal("grid31"),
            z.literal("grid32"),
          ])
          .optional(),
        video: z.string().url().optional(),
        audio: z.string().optional(),
      }),
    });
    try {
      postSchema.parse(req.body);
      return next();
    } catch (error) {
      return ResponseController.HandleUnprocessableEntityError(res, error);
    }
  }

  /**
   * Validates the draft object in the request body.
   */
  public static validateDraft(req: Request, res: Response, next: NextFunction) {
    const draftSchema = z.object({
      content: z.object({
        text: z.string().min(1).max(600),
        images: z.array(z.string().url()).max(3).optional(),
        imagesLayout: z
          .union([
            z.literal("vertical"),
            z.literal("grid31"),
            z.literal("grid32"),
          ])
          .optional(),
        video: z.string().url().optional(),
        audio: z.string().optional(),
      }),
    });
    try {
      draftSchema.parse(req.body);
      return next();
    } catch (error) {
      return ResponseController.HandleUnprocessableEntityError(res, error);
    }
  }

  /**
   * Validates the comment object in the request body.
   */
  public static validateComment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { comment } = req.body;
      const commentSchema = z.object({
        content: z.string().min(1).max(600),
        createdBy: z.string(),
        createdAt: z.date().default(() => new Date()),
      });
      commentSchema.parse(comment);
      return next();
    } catch (error) {
      return ResponseController.HandleUnprocessableEntityError(res, error);
    }
  }
}
