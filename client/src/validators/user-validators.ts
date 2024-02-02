import { z } from "zod";

/**
 * UserValidator class that provides validation for user social links.
 */
export default class UserValidator {
  /**
   * Schema for validating a social link.
   */
  public static socialLinkSchema = z.object({
    name: z
      .string({
        errorMap: () => ({
          message: "Name must be between 3 and 20 characters long.",
        }),
      })
      .min(3)
      .max(20),
    url: z
      .string({ errorMap: () => ({ message: "Please enter a valid URL." }) })
      .url(),
  });
}

export type SocialLinkSchemaType = z.infer<typeof UserValidator.socialLinkSchema>;