import { z } from "zod";

/**
 * Class representing a PostValidator.
 */
export default class PostValidator {
  /**
   * The post schema for validating post content.
   */
  public static postSchema = z.object({
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

  /**
   * Validates the post content.
   * @param post - The post object to be validated.
   * @returns The result of the validation.
   */
  public static validatePostContent = (post: unknown) => {
    return PostValidator.postSchema.safeParse(post);
  };

  /**
   * The comment schema for validating comment content.
   */
  public static commentSchema = z.object({
    content: z.string().min(1).max(600),
    createdBy: z.string(),
    createdAt: z.date().default(() => new Date()),
  });

  /**
   * Validates the comment content.
   * @param comment - The comment object to be validated.
   * @returns The result of the validation.
   */
  public static validateComment = (comment: unknown) => {
    return PostValidator.commentSchema.safeParse(comment);
  };
}
//types
export type PostContentType = z.infer<typeof PostValidator.postSchema>;
export type CommentType = z.infer<typeof PostValidator.commentSchema>;
