import { supportedSocialLinks } from "@/components/shared/badges/social-link-badge";
import { UserType } from "@/types/user.types";
import { z } from "zod";

const supportedSocialLinksValues = [
  "default",
  ...Object.keys(supportedSocialLinks),
] as const;

/**
 * UserValidator class that provides validation for user social links.
 */
export default class UserValidator {
  /**
   * Schema for validating a social link.
   */
  public static SocialLinkSchema = z.object({
    label: z.enum(supportedSocialLinksValues, {
      errorMap: () => ({ message: "Invalid social link label" }),
    }),
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

  /**
   * Validates a social link.
   * @param socialLink The social link to be validated.
   * @returns The result of the validation.
   */
  public static validateSocialLink = (
    socialLink: UserType["socialLinks"][0]
  ) => {
    return UserValidator.SocialLinkSchema.safeParse(socialLink);
  };
}
